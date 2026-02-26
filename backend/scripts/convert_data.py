import pandas as pd
import os
import time

# Define paths
DATA_DIR = r"C:\Users\priya\OneDrive\Desktop\IIT Mandi\Data"
EXCEL_FILE = os.path.join(DATA_DIR, "classification_data.xlsx")
CSV_FILE = os.path.join(DATA_DIR, "classification_data.csv")

def convert_excel_to_csv():
    if not os.path.exists(EXCEL_FILE):
        print(f"Error: Excel file not found at {EXCEL_FILE}")
        return

    print(f"Reading Excel file: {EXCEL_FILE}...")
    start_time = time.time()
    try:
        # Read Excel file
        df = pd.read_excel(EXCEL_FILE)
        read_time = time.time()
        print(f"Excel read complete in {read_time - start_time:.2f} seconds.")
        
        # Save as CSV
        print(f"Saving to CSV: {CSV_FILE}...")
        df.to_csv(CSV_FILE, index=False)
        save_time = time.time()
        print(f"CSV save complete in {save_time - read_time:.2f} seconds.")
        print(f"Total time: {save_time - start_time:.2f} seconds.")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    convert_excel_to_csv()
