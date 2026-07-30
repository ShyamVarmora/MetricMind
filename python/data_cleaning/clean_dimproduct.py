import pandas as pd

# =====================================
# Read DimProduct Dataset
# =====================================

file_path = r"C:\Users\Mansi Kurne\Desktop\MetricMind\dataset\raw\DimProduct.csv"

df = pd.read_csv(file_path)

print("=" * 60)
print("DimProduct Dataset Information")
print("=" * 60)

# =====================================
# Dataset Shape
# =====================================

print("\nRows and Columns:")
print(df.shape)

# =====================================
# Column Names
# =====================================

print("\nColumn Names:")
print(df.columns.tolist())

# =====================================
# Data Types
# =====================================

print("\nData Types:")
print(df.dtypes)

# =====================================
# Missing Values
# =====================================

print("\nMissing Values:")
print(df.isnull().sum())

# =====================================
# Duplicate Records
# =====================================

duplicates = df.duplicated().sum()

print("\nDuplicate Rows:", duplicates)

# =====================================
# Remove LargePhoto Column
# =====================================

if "LargePhoto" in df.columns:
    df.drop(columns=["LargePhoto"], inplace=True)
    print("\n✅ LargePhoto column removed.")

# =====================================
# Save Cleaned Dataset
# =====================================

output_path = r"C:\Users\Mansi Kurne\Desktop\MetricMind\dataset\cleaned\DimProduct_Cleaned.csv"

df.to_csv(output_path, index=False)

print("\n✅ Cleaned file saved successfully!")
print(output_path)