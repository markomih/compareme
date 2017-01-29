import pandas as pd

from shared.helpers import validate_json, parse_json


class DataProcessing:
    N = int(2)

    def __init__(self, file_path):
        data = pd.read_csv(file_path)
        # labels = list(data.columns.values)
        ret_data = pd.concat([data.head(self.N), data.tail(self.N)])
        self.ret_json_data = ret_data.to_json()

        print(self.ret_json_data)

    @validate_json
    def get_data(self) -> str:
        s = parse_json({'columns': self.ret_json_data, 'table_id': 1})
        return s

    @staticmethod
    @validate_json
    def get_data(file_path: str) -> str:
        data = pd.read_csv(file_path)
        ret_data = pd.concat([data.head(DataProcessing.N), data.tail(DataProcessing.N)])
        json_data = ret_data.to_json()
        s = parse_json({'columns': ret_data.to_json(), 'table_id': 1})
        return s
        # return parse_json(json_data)
