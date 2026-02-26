import pandas as pd
from typing import Optional, Dict, Any
import os

class DatasetLoader:
    def __init__(self, csv_path: Optional[str] = None):
        self.csv_path = csv_path
        self.df = pd.DataFrame()
        if csv_path and os.path.exists(csv_path):
            self.load(csv_path)

    def load(self, csv_path: str):
        self.csv_path = csv_path
        # support CSV and Excel
        if csv_path.lower().endswith('.csv'):
            self.df = pd.read_csv(csv_path)
        elif csv_path.lower().endswith(('.xls', '.xlsx')):
            # requires openpyxl or xlrd depending on file type
            self.df = pd.read_excel(csv_path)
        else:
            # attempt to read with pandas generic loader
            try:
                self.df = pd.read_csv(csv_path)
            except Exception:
                self.df = pd.DataFrame()
        self.df.reset_index(drop=True, inplace=True)

    def get_row(self, index: int) -> Dict[str, Any]:
        if index < 0 or index >= len(self.df):
            raise IndexError("Index out of bounds")
        return self.df.iloc[index].to_dict()

    def length(self):
        return len(self.df)
 