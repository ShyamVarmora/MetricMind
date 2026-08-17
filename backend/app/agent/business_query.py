from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any

from app.database import get_connection
from app.semantic_layer import is_allowed_metric

EUROPE = ("France", "Germany", "United Kingdom")
COUNTRIES = {
    "australia": "Australia", "canada": "Canada", "france": "France", "germany": "Germany",
    "uk": "United Kingdom", "united kingdom": "United Kingdom", "spain": "Spain", "italy": "Italy",
    "united states": "United States", "usa": "United States", "mexico": "Mexico",
    "netherlands": "Netherlands", "belgium": "Belgium", "portugal": "Portugal",
}
LABELS = {
    "totalRevenue": "sales/revenue", "totalCost": "cost", "shippingCost": "shipping cost",
    "marginPercent": "margin", "profit": "profit", "transactionCount": "orders",
    "customers": "customers", "products": "products", "quantity": "quantity", "averageOrderValue": "average order value",
}


@dataclass
class QuerySpec:
    metric: str
    group_by: str | None = None
    countries: tuple[str, ...] | None = None
    country: str | None = None
    gender: str | None = None
    start: str | None = None
    end: str | None = None
    year: int | None = None
    quarter: int | None = None
    last_quarter: bool = False
    order: str = "DESC"
    limit: int = 10


def money(value: Any) -> str:
    return f"{float(value or 0):,.2f}"


def conversation(question: str) -> str | None:
    q = question.lower().strip()
    if re.fullmatch(r"(hello|hi|hey|hello there|hi there|hey there)[!. ]*", q):
        return "Hello. I can analyse the MetricMind business data. Ask about sales, revenue, profit, costs, margins, orders, customers, products, trends, countries, quarters, or dates."
    if re.search(r"\b(thanks|thank you|thx)\b", q):
        return "You're welcome. Ask another business-data question whenever you need."
    if re.search(r"\b(who are you|what can you do|help)\b", q):
        return "I am the MetricMind analytics assistant. I answer business-data questions through governed database queries and can analyse sales, revenue, profit, costs, margins, orders, customers, products, trends, countries, quarters, months, and supported dimensions."
    return None


def parse_question(question: str) -> QuerySpec:
    q = question.lower().strip()
    if not q:
        raise ValueError("Question cannot be empty.")
    dates = re.findall(r"\b20\d{2}-\d{2}-\d{2}\b", q)
    start, end = (dates[0], dates[1]) if len(dates) >= 2 else ((dates[0], None) if dates else (None, None))
    metric_patterns = [
        ("averageOrderValue", r"\b(average order value|aov|average order)\b"), ("quantity", r"\b(quantity|units|items sold)\b"),
        ("shippingCost", r"\b(shipping|freight)\b"), ("totalCost", r"\b(material cost|material costs|cost|costs)\b"),
        ("marginPercent", r"\b(margin|margins|margin percentage|margin %)\b"), ("profit", r"\b(profit|profits|earnings)\b"),
        ("transactionCount", r"\b(order|orders|transaction|transactions)\b"), ("customers", r"\b(customer|customers|clients)\b"),
        ("products", r"\b(product|products)\b"), ("totalRevenue", r"\b(sales|sale|revenue|turnover|income)\b"),
    ]
    metric = next((name for name, pattern in metric_patterns if re.search(pattern, q)), None)
    if metric is None or not is_allowed_metric(metric):
        raise ValueError("I can answer questions about the MetricMind business data. Try sales, revenue, profit, cost, margin, orders, customers, products, trends, or a breakdown.")
    spec = QuerySpec(metric=metric, start=start, end=end)
    if re.search(r"\beurop\w*\b", q): spec.countries = EUROPE
    for name, canonical in COUNTRIES.items():
        if re.search(rf"\b{re.escape(name)}\b", q): spec.country, spec.countries = canonical, None; break
    if re.search(r"\b(male|men|man)\b", q): spec.gender = "M"
    elif re.search(r"\b(female|women|woman)\b", q): spec.gender = "F"
    year = re.search(r"\b(20\d{2})\b", q)
    if year: spec.year = int(year.group(1))
    qmatch = re.search(r"\bq(?:uarter)?\s*([1-4])\b", q)
    if qmatch: spec.quarter = int(qmatch.group(1))
    elif re.search(r"\b(last|previous|prior) quarter\b", q): spec.last_quarter = True
    groups = [
        ("country", r"\b(by|per|across)\s+country\b|\bcountries\b"), ("customer", r"\b(by|per|across)\s+customers?\b|\b(top|best|highest|lowest)\s+customers?\b"),
        ("product", r"\b(by|per|across)\s+products?\b|\b(top|best|highest|lowest|worst)\s+(selling\s+)?products?\b"), ("gender", r"\b(by|per|across)\s+gender\b"),
        ("occupation", r"\b(by|per|across)\s+occupation\b"), ("color", r"\b(by|per|across)\s+color\b"), ("product_line", r"\b(by|per|across)\s+product\s+line\b"),
        ("marital_status", r"\b(by|per|across)\s+marital( status)?\b"), ("education", r"\b(by|per|across)\s+education( level)?\b"), ("income", r"\b(by|per|across)\s+income( group)?\b"),
        ("month", r"\b(month|monthly|month-wise|monthwise)\b"), ("quarter", r"\b(quarter|quarterly)\b"), ("year", r"\b(year|yearly|annual|annually)\b"),
    ]
    for group, pattern in groups:
        if re.search(pattern, q): spec.group_by = group; break
    if re.search(r"\b(lowest|bottom|worst)\b", q): spec.order = "ASC"
    return spec


def joins(extra: str = "") -> str:
    return "JOIN dimdate d ON f.OrderDateKey=d.DateKey JOIN dimcustomer c ON f.CustomerKey=c.CustomerKey JOIN dimgeography g ON c.GeographyKey=g.GeographyKey " + extra


def metric_sql(metric: str) -> str:
    return {
        "totalRevenue": "SUM(f.SalesAmount)", "totalCost": "SUM(f.TotalProductCost)+SUM(f.Freight)", "shippingCost": "SUM(f.Freight)",
        "profit": "SUM(f.SalesAmount)-SUM(f.TotalProductCost)-SUM(f.Freight)", "marginPercent": "((SUM(f.SalesAmount)-SUM(f.TotalProductCost)-SUM(f.Freight))/NULLIF(SUM(f.SalesAmount),0))*100",
        "transactionCount": "COUNT(DISTINCT f.SalesOrderNumber)", "customers": "COUNT(DISTINCT f.CustomerKey)", "products": "COUNT(DISTINCT f.ProductKey)",
        "quantity": "SUM(f.OrderQuantity)", "averageOrderValue": "SUM(f.SalesAmount)/NULLIF(COUNT(DISTINCT f.SalesOrderNumber),0)",
    }[metric]


def where(spec: QuerySpec) -> tuple[str, list[Any]]:
    parts, params = ["1=1"], []
    if spec.start: parts.append("d.FullDateAlternateKey >= %s"); params.append(spec.start)
    if spec.end: parts.append("d.FullDateAlternateKey <= %s"); params.append(spec.end)
    if spec.countries: parts.append("g.EnglishCountryRegionName IN (%s,%s,%s)"); params.extend(spec.countries)
    elif spec.country: parts.append("g.EnglishCountryRegionName=%s"); params.append(spec.country)
    if spec.gender: parts.append("c.Gender=%s"); params.append(spec.gender)
    if spec.year: parts.append("d.CalendarYear=%s"); params.append(spec.year)
    if spec.quarter:
        parts.append("d.CalendarQuarter=%s"); params.append(spec.quarter)
        if not spec.year: parts.append("d.CalendarYear=(SELECT MAX(CalendarYear) FROM dimdate WHERE CalendarQuarter=%s)"); params.append(spec.quarter)
    return " AND ".join(parts), params


GROUPS = {
    "country": ("g.EnglishCountryRegionName", ""), "customer": ("CONCAT_WS(' ',c.FirstName,c.LastName)", ""), "product": ("p.EnglishProductName", "JOIN dimproduct p ON f.ProductKey=p.ProductKey"),
    "gender": ("c.Gender", ""), "occupation": ("c.EnglishOccupation", ""), "color": ("p.Color", "JOIN dimproduct p ON f.ProductKey=p.ProductKey"),
    "product_line": ("p.ProductLine", "JOIN dimproduct p ON f.ProductKey=p.ProductKey"), "marital_status": ("c.MaritalStatus", ""), "education": ("c.EnglishEducation", ""),
    "income": ("c.YearlyIncome", ""), "month": ("CONCAT(d.CalendarYear,'-',LPAD(d.MonthNumberOfYear,2,'0'))", ""), "quarter": ("CONCAT(d.CalendarYear,'-Q',d.CalendarQuarter)", ""), "year": ("d.CalendarYear", ""),
}


def execute_query(spec: QuerySpec) -> tuple[list[dict], str, list[Any], dict]:
    conn = get_connection(); cursor = conn.cursor(dictionary=True)
    try:
        expr = metric_sql(spec.metric); base_where, params = where(spec)
        if spec.last_quarter:
            sql = f"SELECT ROUND({expr},2) AS value FROM factinternetsales f {joins()} WHERE {base_where} AND (d.CalendarYear,d.CalendarQuarter)=(SELECT x.CalendarYear,x.CalendarQuarter FROM (SELECT d2.CalendarYear,d2.CalendarQuarter FROM dimdate d2 JOIN factinternetsales f2 ON f2.OrderDateKey=d2.DateKey GROUP BY d2.CalendarYear,d2.CalendarQuarter ORDER BY d2.CalendarYear DESC,d2.CalendarQuarter DESC LIMIT 1) x)"
            cursor.execute(sql, params); row = cursor.fetchone() or {"value": 0}; return [{"value": float(row["value"] or 0)}], sql, params, {"last_quarter": True}
        if spec.group_by:
            group_expr, extra = GROUPS[spec.group_by]; limit = min(spec.limit, 1000)
            sql = f"SELECT {group_expr} AS label, ROUND({expr},2) AS value FROM factinternetsales f {joins(extra)} WHERE {base_where} AND {group_expr} IS NOT NULL GROUP BY {group_expr} ORDER BY value {spec.order} LIMIT %s"
            cursor.execute(sql, [*params, limit]); rows = cursor.fetchall(); return [{"label": r["label"], "value": float(r["value"] or 0)} for r in rows], sql, [*params, limit], {"group_by": spec.group_by}
        sql = f"SELECT ROUND({expr},2) AS value FROM factinternetsales f {joins()} WHERE {base_where}"
        cursor.execute(sql, params); row = cursor.fetchone() or {"value": 0}; return [{"value": float(row["value"] or 0)}], sql, params, {}
    finally:
        cursor.close(); conn.close()


def sales_trend(spec: QuerySpec) -> tuple[list[dict], str, list[Any]]:
    conn = get_connection(); cursor = conn.cursor(dictionary=True)
    try:
        base_where, params = where(spec)
        sql = f"SELECT CONCAT(d.CalendarYear,'-',LPAD(d.MonthNumberOfYear,2,'0')) AS label, ROUND(SUM(f.SalesAmount),2) AS value FROM factinternetsales f JOIN dimdate d ON f.OrderDateKey=d.DateKey JOIN dimcustomer c ON f.CustomerKey=c.CustomerKey JOIN dimgeography g ON c.GeographyKey=g.GeographyKey WHERE {base_where} GROUP BY d.CalendarYear,d.MonthNumberOfYear ORDER BY d.CalendarYear,d.MonthNumberOfYear LIMIT 1000"
        cursor.execute(sql, params); rows = [{"label": r["label"], "value": float(r["value"] or 0)} for r in cursor.fetchall()]; return rows, sql, params
    finally:
        cursor.close(); conn.close()


def europe_margin_analysis() -> tuple[dict, str, list[Any]]:
    conn = get_connection(); cursor = conn.cursor(dictionary=True)
    try:
        sql = "SELECT d.CalendarYear AS year,d.CalendarQuarter AS quarter,ROUND(SUM(f.SalesAmount),2) AS revenue,ROUND(SUM(f.TotalProductCost),2) AS material_cost,ROUND(SUM(f.Freight),2) AS shipping_cost,ROUND(((SUM(f.SalesAmount)-SUM(f.TotalProductCost)-SUM(f.Freight))/NULLIF(SUM(f.SalesAmount),0))*100,2) AS margin_percent FROM factinternetsales f JOIN dimdate d ON f.OrderDateKey=d.DateKey JOIN dimcustomer c ON f.CustomerKey=c.CustomerKey JOIN dimgeography g ON c.GeographyKey=g.GeographyKey WHERE g.EnglishCountryRegionName IN (%s,%s,%s) GROUP BY d.CalendarYear,d.CalendarQuarter ORDER BY d.CalendarYear DESC,d.CalendarQuarter DESC LIMIT 2"
        cursor.execute(sql, list(EUROPE)); rows = cursor.fetchall()
        if len(rows) < 2: return {"rows": rows}, sql, list(EUROPE)
        latest, previous = rows
        return {"rows": rows, "latest": latest, "previous": previous, "shipping_change": round(float(latest["shipping_cost"] or 0)-float(previous["shipping_cost"] or 0),2), "material_change": round(float(latest["material_cost"] or 0)-float(previous["material_cost"] or 0),2), "revenue_change": round(float(latest["revenue"] or 0)-float(previous["revenue"] or 0),2), "margin_change": round(float(latest["margin_percent"] or 0)-float(previous["margin_percent"] or 0),2)}, sql, list(EUROPE)
    finally:
        cursor.close(); conn.close()


def answer(question: str, spec: QuerySpec | None, data: list[dict], root: dict | None = None) -> str:
    chat = conversation(question)
    if chat: return chat
    if root is not None:
        rows = root["rows"]
        if len(rows) < 2: return "There are not two comparable European quarters in the database, so I cannot establish a margin change."
        latest, previous, change = root["latest"], root["previous"], root["margin_change"]
        if change >= 0: return f"European margin did not drop. It changed from {previous['margin_percent']:.2f}% in Q{previous['quarter']} {previous['year']} to {latest['margin_percent']:.2f}% in Q{latest['quarter']} {latest['year']}, an improvement of {change:.2f} percentage points."
        driver = "shipping cost" if abs(root["shipping_change"]) >= abs(root["material_change"]) else "material cost"
        return f"European margin dropped from {previous['margin_percent']:.2f}% in Q{previous['quarter']} {previous['year']} to {latest['margin_percent']:.2f}% in Q{latest['quarter']} {latest['year']}, a decline of {abs(change):.2f} percentage points. The largest available cost movement was {driver}: shipping changed by ₹{money(root['shipping_change'])} and material cost changed by ₹{money(root['material_change'])}. Revenue changed by ₹{money(root['revenue_change'])}. The current MySQL dataset has product cost and freight, but no separate other-cost field."
    if spec.group_by:
        if not data: return "No matching data was found for the selected filters."
        return f"Here are the {LABELS[spec.metric]} results by {spec.group_by.replace('_',' ')}. The leading result is {data[0]['label']} with {data[0]['value']:,.2f}."
    value = data[0]["value"] if data else 0; scope = []
    if spec.countries: scope.append("Europe")
    if spec.country: scope.append(spec.country)
    if spec.year: scope.append(str(spec.year))
    if spec.quarter: scope.append(f"Q{spec.quarter}")
    if spec.last_quarter: scope.append("last quarter")
    if spec.start or spec.end: scope.append(f"{spec.start or 'earliest'} to {spec.end or 'latest'}")
    return f"The {LABELS[spec.metric]} is ₹{money(value)}" + (f" for {', '.join(scope)}." if scope else ".")


def execute_question(question: str) -> dict:
    chat = conversation(question)
    if chat:
        return {"query": {"type": "conversation"}, "answer": chat, "data": [], "api_trace": [{"endpoint": "agent.conversation", "metric": "conversation", "operation": "no_database_query"}], "sql": None, "params": [], "reasoning_steps": ["Recognized a conversational request; no database query was required."]}
    spec = parse_question(question); q = question.lower()
    if spec.metric == "marginPercent" and ("why" in q or re.search(r"\b(drop|dropped|decrease|decreased|fall|fell)\b", q)):
        root, sql, params = europe_margin_analysis()
        return {"query": {"metric": "marginPercent", "filters": {"Europe": True}, "group_by": ["quarter"], "time_range": "latest two available quarters"}, "answer": answer(question, spec, root["rows"], root=root), "data": root["rows"], "api_trace": [{"endpoint": "data_service.europe_margin_quarters", "metric": "marginPercent", "operation": "parameterized_database_query"}, {"endpoint": "agent.root_cause_cost_breakdown", "metric": "cost", "operation": "secondary_breakdown"}], "sql": sql, "params": params, "reasoning_steps": ["Filter to Europe.", "Compare the latest two available quarters.", "Calculate the margin change.", "Compare shipping and product-cost movement.", "Explain the largest measured driver without inventing unavailable fields."]}
    if "why" in q and spec.metric == "totalRevenue":
        trend, sql, params = sales_trend(spec); changes = []
        for previous, current in zip(trend, trend[1:]):
            delta = current["value"]-previous["value"]; changes.append((current["label"], delta, (delta/previous["value"]*100) if previous["value"] else 0))
        positive = [x for x in changes if x[1] > 0]
        if positive:
            month, delta, pct = max(positive, key=lambda x: x[1]); text = f"Sales increased most strongly in {month}, rising by ₹{money(delta)} ({pct:.2f}%) from the previous month. This is a measured trend; the dataset does not provide enough causal fields to claim why demand changed."
        else: text = "The available monthly data does not contain a positive month-to-month sales increase."
        return {"query": {"metric": "totalRevenue", "filters": {"Europe": bool(spec.countries)}, "group_by": ["month"], "time_range": "selected period"}, "answer": text, "data": trend, "api_trace": [{"endpoint": "data_service.monthly_sales_trend", "metric": "totalRevenue", "operation": "parameterized_database_query"}], "sql": sql, "params": params, "reasoning_steps": ["Retrieve monthly sales.", "Compare each month with the previous month.", "Identify the strongest measured increase."]}
    data, sql, params, filters = execute_query(spec)
    return {"query": {"metric": spec.metric, "filters": filters, "group_by": [spec.group_by] if spec.group_by else [], "time_range": f"{spec.start or 'earliest'} to {spec.end or 'latest'}" if spec.start or spec.end else None}, "answer": answer(question, spec, data), "data": data, "api_trace": [{"endpoint": "data_service.execute_business_query", "metric": spec.metric, "operation": "parameterized_database_query"}], "sql": sql, "params": params, "reasoning_steps": ["Map the question to a governed metric and filters.", "Execute a parameterized database query.", "Format the result as a business answer."]}
