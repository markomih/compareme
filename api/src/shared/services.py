import pickle
from io import StringIO

import numpy as np
import pandas as pd
from bson.binary import Binary
from bson.objectid import ObjectId
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
from passlib.handlers.sha2_crypt import sha256_crypt
from pymongo import MongoClient
from sklearn import preprocessing, cross_validation, svm, neighbors
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis

from conf import DATABASE, SECRET_KEY
from shared.models import User, Dataset


class Base:
    _client = MongoClient(DATABASE['ADDRESS'])
    db = _client[DATABASE['NAME']]

    users = db.users
    datasets = db.datasets


class UserService:
    @staticmethod
    def create(user: User) -> ObjectId:
        try:
            user.password = sha256_crypt.encrypt(user.password)
            user_id = Base.users.insert_one(user.get_dict()).inserted_id
            return user_id
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def get(email: str, user_id: ObjectId = None):
        user = Base.users.find_one({"_id": user_id} if user_id else {"email": email})

        return User.get_model(user), user['_id']

    @staticmethod
    def check(email: str, password: str) -> bool:
        user = Base.users.find_one({"email": email})
        if user:
            db_password = User.get_model(user).password
            if sha256_crypt.verify(password, db_password):
                return True
        return False

    @staticmethod
    def does_exist(email: str) -> bool:
        user = Base.users.find_one({"email": email})

        return True if user else False

    @staticmethod
    def generate_auth_token(user_id: str, expiration=60000) -> str:
        s = Serializer(SECRET_KEY, expires_in=expiration)
        salt = user_id

        return s.dumps({'id': salt}).decode('utf-8')

    @staticmethod
    def verify_auth_token(token: str):
        s = Serializer(SECRET_KEY)
        try:
            data = s.loads(token.encode())
        except SignatureExpired as e:
            print(e)
            return None, None  # valid token, but expired
        except BadSignature as e:
            print(e)
            return None, None  # invalid token
        user_id_str = data['id']
        user_id = ObjectId(user_id_str)
        user, _id = UserService.get("", user_id)

        return user, _id


class DatasetService:
    @staticmethod
    def get_data(file):
        content_str = file.read().decode('utf-8')
        content = StringIO(content_str)
        df = pd.read_csv(content, sep=',')
        df.fillna(value=-999999, inplace=True)
        df.replace('?', -99999, inplace=True)
        return df

    @staticmethod
    def create(dataset: Dataset, user_id: ObjectId) -> Dataset:
        try:
            d = dataset.get_dict()
            dataset_id = Base.datasets.insert_one(d).inserted_id
            Base.users.update_one({'_id': user_id}, {'$push': {'data_ids': dataset_id}}, upsert=False)
            dataset.table_id = dataset_id
            return dataset
        except Exception as e:
            print(e)
        return None

    @staticmethod
    def get(dataset_id: ObjectId) -> Dataset:
        try:
            dataset = Base.datasets.find_one({"_id": dataset_id})

            model_dataset = Dataset.get_model(dataset)
            return model_dataset
        except Exception as e:
            print(e)
        return None

    @staticmethod
    def predict(classifier: str, dataset_id: ObjectId, _predict):
        try:
            pickled_string = Base.datasets.find_one({'_id': dataset_id})
            clf = pickle.loads(pickled_string['pickle'])
            args = [p['value'] for p in _predict]
            measure = np.array(args).reshape(1, -1)
            prediction = clf.predict(measure)
            return prediction[0]
        except Exception as e:
            print(e)
            return 0

    @staticmethod
    def apply(classifier: str, dataset_id: ObjectId, removed_labels: list, class_label: str):
        classifier = classifier.lower()
        if classifier != 'svm' and classifier != 'knn' and classifier != 'qda' and classifier != 'lda':
            return 0
        try:
            dataset = DatasetService.get(dataset_id)
            filtered_dropped_classes = [d for d in removed_labels if d in dataset.data.columns.values]
            if filtered_dropped_classes:
                dataset.data.drop(filtered_dropped_classes, 1, inplace=True)
                Base.datasets.update_one({'_id': dataset_id}, {'$set': {'columns': dataset.data.to_json()}},
                                         upsert=False)

            X = np.array(dataset.data.drop([class_label], 1))
            y = np.array(dataset.data[class_label])
            X = preprocessing.scale(X)
            X_train, X_test, y_train, y_test = cross_validation.train_test_split(X, y, test_size=0.2)
            clf = None
            if classifier == 'svm':
                clf = svm.SVR()
            if classifier == 'knn':
                clf = neighbors.KNeighborsClassifier(n_neighbors=3)
            if classifier == 'lda':
                clf = LinearDiscriminantAnalysis()
            if classifier == 'qda':
                clf = QuadraticDiscriminantAnalysis()

            clf.fit(X_train, y_train)
            score = clf.score(X_test, y_test)

            pickled_classifier = pickle.dumps(clf)
            Base.datasets.update_one({'_id': dataset_id},
                                     {'$set': {'pickle': Binary(pickled_classifier)}}, upsert=True)
            # threading.Thread(target=DatasetService.save_clf, args=(dataset_id, clf)).start()
        except Exception as e:
            print(e)
        else:
            return score

    @staticmethod
    def save_clf(dataset_id, clf):
        try:
            pickled_classifier = pickle.dumps(clf)
            Base.datasets.update_one({'_id': dataset_id},
                                     {'$set': {'pickle': Binary(pickled_classifier)}}, upsert=True)

        except Exception as e:
            print(e)

    @staticmethod
    def get_tables_json(table_ids: list):
        tables = Base.datasets.find({'_id': {'$in': table_ids}})

        list_json = []
        for table in tables:
            list_json.append({
                'name': table['name'],
                'table_id': str(table['_id'])
            })
        return list_json
