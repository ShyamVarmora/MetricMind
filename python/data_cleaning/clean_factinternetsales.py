import pandas as pd

# =====================================
# Read FactInternetSales Dataset
# =====================================

file_path = r"C:\Users\Mansi Kurne\Desktop\MetricMind\dataset\raw\FactInternetSales.csv"

df = pd.read_csv(file_path)

print("=" * 60)
print("FactInternetSales Dataset Information")
print("=" * 60)

# Dataset Shape
print("\nRows and Columns:")
print(df.shape)

# Column Names
print("\nColumn Names:")
print(df.columns.tolist())

# Data Types
print("\nData Types:")
print(df.dtypes)

# Missing Values
print("\nMissing Values:")
print(df.isnull().sum())

# Duplicate Records
duplicates = df.duplicated().sum()
print("\nDuplicate Rows:", duplicates)

# Save Cleaned Dataset
output_path = r"C:\Users\Mansi Kurne\Desktop\MetricMind\dataset\cleaned\FactInternetSales_Cleaned.csv"

df.to_csv(output_path, index=False)

print("\n✅ Cleaned file saved successfully!")
print(output_path)