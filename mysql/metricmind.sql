CREATE DATABASE metricmind;
USE metricmind;
SELECT VERSION();
SELECT COUNT(*) FROM dimcustomer;
SELECT COUNT(*) FROM dimdate;
SELECT COUNT(*) FROM dimgeography;
SELECT COUNT(*) FROM factinternetsales;
SHOW CREATE TABLE dimcustomer;
USE metricmind;

SELECT COUNT(*) FROM dimproduct;

/*SQL ANALYSIS*/

/*Total sales*/
SELECT
    ROUND(SUM(SalesAmount), 2) AS Total_Sales
FROM FactInternetSales;

/*Total Number of Orders*/
SELECT
    COUNT(DISTINCT SalesOrderNumber) AS Total_Orders
FROM FactInternetSales;

/*Total Customers*/
SELECT
    COUNT(DISTINCT CustomerKey) AS Total_Customers
FROM FactInternetSales;

/*Total Products Sold*/
SELECT
    COUNT(DISTINCT ProductKey) AS Products_Sold
FROM FactInternetSales;

/*Average Order Value*/
SELECT
    ROUND(AVG(SalesAmount), 2) AS Average_Order_Value
FROM FactInternetSales;

/*Top 10 Best Selling Products*/
SELECT
    p.EnglishProductName,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimProduct p
ON f.ProductKey = p.ProductKey
GROUP BY p.EnglishProductName
ORDER BY Total_Sales DESC
LIMIT 10;

/*Top 10 Customers*/
SELECT
    CONCAT(c.FirstName,' ',c.LastName) AS Customer_Name,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimCustomer c
ON f.CustomerKey = c.CustomerKey
GROUP BY Customer_Name
ORDER BY Total_Sales DESC
LIMIT 10;

/*Sales by Country*/
SELECT
    g.EnglishCountryRegionName,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimCustomer c
ON f.CustomerKey = c.CustomerKey
JOIN DimGeography g
ON c.GeographyKey = g.GeographyKey
GROUP BY g.EnglishCountryRegionName
ORDER BY Total_Sales DESC;

/*Sales by Gender*/
SELECT
    c.Gender,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimCustomer c
ON f.CustomerKey = c.CustomerKey
GROUP BY c.Gender;

/*Sales by Occupation*/
SELECT
    c.EnglishOccupation,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimCustomer c
ON f.CustomerKey = c.CustomerKey
GROUP BY c.EnglishOccupation
ORDER BY Total_Sales DESC;

/*Yearly Sales Trend*/
SELECT
    d.CalendarYear,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimDate d
ON f.OrderDateKey = d.DateKey
GROUP BY d.CalendarYear
ORDER BY d.CalendarYear;

/*Monthly Sales Trend*/
SELECT
    d.EnglishMonthName,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimDate d
ON f.OrderDateKey = d.DateKey
GROUP BY
    d.MonthNumberOfYear,
    d.EnglishMonthName
ORDER BY d.MonthNumberOfYear;

/*Quarterly Sales*/
SELECT
    d.CalendarQuarter,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimDate d
ON f.OrderDateKey = d.DateKey
GROUP BY d.CalendarQuarter
ORDER BY d.CalendarQuarter;

/*Sales by Product Color*/
SELECT
    p.Color,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimProduct p
ON f.ProductKey = p.ProductKey
WHERE p.Color IS NOT NULL
GROUP BY p.Color
ORDER BY Total_Sales DESC;

/*Sales by Product Line*/
SELECT
    p.ProductLine,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimProduct p
ON f.ProductKey = p.ProductKey
WHERE p.ProductLine IS NOT NULL
GROUP BY p.ProductLine
ORDER BY Total_Sales DESC;

/*Sales by Marital Status*/
SELECT
    c.MaritalStatus,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimCustomer c
ON f.CustomerKey = c.CustomerKey
GROUP BY c.MaritalStatus;

/*Sales by Education Level*/
SELECT
    c.EnglishEducation,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales
FROM FactInternetSales f
JOIN DimCustomer c
ON f.CustomerKey = c.CustomerKey
GROUP BY c.EnglishEducation
ORDER BY Total_Sales DESC;

/*Average Sales by Income Group*/
SELECT
    c.YearlyIncome,
    ROUND(AVG(f.SalesAmount),2) AS Average_Sales
FROM FactInternetSales f
JOIN DimCustomer c
ON f.CustomerKey = c.CustomerKey
GROUP BY c.YearlyIncome
ORDER BY c.YearlyIncome;

/*Highest Selling Products by Quantity*/
SELECT
    p.EnglishProductName,
    SUM(f.OrderQuantity) AS Total_Quantity
FROM FactInternetSales f
JOIN DimProduct p
ON f.ProductKey = p.ProductKey
GROUP BY p.EnglishProductName
ORDER BY Total_Quantity DESC
LIMIT 10;

/*Top Countries by Orders*/
SELECT
    g.EnglishCountryRegionName,
    COUNT(DISTINCT f.SalesOrderNumber) AS Total_Orders
FROM FactInternetSales f
JOIN DimCustomer c
ON f.CustomerKey = c.CustomerKey
JOIN DimGeography g
ON c.GeographyKey = g.GeographyKey
GROUP BY g.EnglishCountryRegionName
ORDER BY Total_Orders DESC;

/*Rank Products by Sales*/
SELECT
    p.EnglishProductName,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales,
    RANK() OVER (
        ORDER BY SUM(f.SalesAmount) DESC
    ) AS Product_Rank
FROM FactInternetSales f
JOIN DimProduct p
ON f.ProductKey = p.ProductKey
GROUP BY p.EnglishProductName;

/*Dense Rank Products*/
SELECT
    p.EnglishProductName,
    ROUND(SUM(f.SalesAmount),2) AS Total_Sales,
    DENSE_RANK() OVER(
        ORDER BY SUM(f.SalesAmount) DESC
    ) AS DenseRank
FROM FactInternetSales f
JOIN DimProduct p
ON f.ProductKey = p.ProductKey
GROUP BY p.EnglishProductName;

/*Running Total of Sales*/
SELECT
    d.CalendarYear,
    ROUND(SUM(f.SalesAmount),2) AS Yearly_Sales,

    ROUND(
        SUM(SUM(f.SalesAmount))
        OVER(
            ORDER BY d.CalendarYear
        ),
    2) AS Running_Total

FROM FactInternetSales f

JOIN DimDate d
ON f.OrderDateKey=d.DateKey

GROUP BY d.CalendarYear;

/*Top Product in Each Year*/
WITH ProductSales AS
(
SELECT

d.CalendarYear,

p.EnglishProductName,

SUM(f.SalesAmount) AS TotalSales,

RANK() OVER(
PARTITION BY d.CalendarYear
ORDER BY SUM(f.SalesAmount) DESC
) AS rnk

FROM FactInternetSales f

JOIN DimDate d
ON f.OrderDateKey=d.DateKey

JOIN DimProduct p
ON f.ProductKey=p.ProductKey

GROUP BY
d.CalendarYear,
p.EnglishProductName

)

SELECT *

FROM ProductSales

WHERE rnk=1;

/*Top 5 Customers in Each Country*/
WITH CustomerSales AS
(
SELECT

g.EnglishCountryRegionName,

CONCAT(c.FirstName,' ',c.LastName) AS CustomerName,

SUM(f.SalesAmount) AS TotalSales,

ROW_NUMBER() OVER(
PARTITION BY g.EnglishCountryRegionName
ORDER BY SUM(f.SalesAmount) DESC
) AS rn

FROM FactInternetSales f

JOIN DimCustomer c
ON f.CustomerKey=c.CustomerKey

JOIN DimGeography g
ON c.GeographyKey=g.GeographyKey

GROUP BY
g.EnglishCountryRegionName,
CustomerName

)

SELECT *

FROM CustomerSales

WHERE rn<=5;