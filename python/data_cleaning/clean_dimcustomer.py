import pandas as pd

# ==============================
# Read the CSV File
# ==============================

file_path = r"C:\Users\Mansi Kurne\Desktop\MetricMind\dataset\raw\DimCustomer.csv"

df = pd.read_csv(file_path)

# ==============================
# Display Basic Information
# ==============================

print("=" * 50)
print("DimCustomer Dataset Information")
print("=" * 50)

print("\nNumber of Rows and Columns:")
print(df.shape)

print("\nColumn Names:")
print(df.columns.tolist())

print("\nData Types:")
print(df.dtypes)

# ==============================
# Missing Values
# ==============================

print("\nMissing Values:")
print(df.isnull().sum())

# ==============================
# Duplicate Records
# ==============================

duplicates = df.duplicated().sum()

print("\nDuplicate Rows:", duplicates)

# ==============================
# Save a Clean Copy
# ==============================

output_path = r"C:\Users\Mansi Kurne\Desktop\MetricMind\dataset\cleaned\DimCustomer_Cleaned.csv"

df.to_csv(output_path, index=False)

print("\n✅ Cleaned file saved successfully!")
print(output_path)