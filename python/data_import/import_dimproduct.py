import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.engine import URL

# =====================================
# MySQL Connection Details
# =====================================

username = "root"
password = "m@nu"
host = "localhost"
port = 3306
database = "metricmind"

# Safe connection URL
connection_url = URL.create(
    drivername="mysql+pymysql",
    username=username,
    password=password,
    host=host,
    port=port,
    database=database
)

engine = create_engine(connection_url)

# =====================================
# CSV File Path
# =====================================

csv_file = r"C:\Users\Mansi Kurne\Desktop\MetricMind\dataset\raw\DimProduct.csv"

# =====================================
# Read CSV
# =====================================

df = pd.read_csv(csv_file)

print("=" * 50)
print("Preview of Dataset")
print("=" * 50)
print(df.head())

print("\nTotal Rows   :", len(df))
print("Total Columns:", len(df.columns))

# =====================================
# Remove LargePhoto Column
# =====================================

if "LargePhoto" in df.columns:
    df.drop(columns=["LargePhoto"], inplace=True)
    print("\n✅ LargePhoto column removed.")

print("\nRemaining Columns:", len(df.columns))

# =====================================
# Import into MySQL
# =====================================

try:
    df.to_sql(
        name="dimproduct",
        con=engine,
        if_exists="replace",
        index=False
    )

    print("\n" + "=" * 50)
    print("🎉 DimProduct imported successfully!")
    print("=" * 50)

except Exception as e:
    print("\n❌ Error while importing:")
    print(e)