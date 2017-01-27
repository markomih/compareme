import os

from shared.models import User
from conf import DATABASE, SECRET_KEY
from pymongo import MongoClient
from bson.objectid import ObjectId
from passlib.handlers.sha2_crypt import sha256_crypt
from base64 import b64encode
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)


class Base:
    _client = MongoClient(DATABASE['ADDRESS'])
    db = _client[DATABASE['NAME']]

    users = db.users
    datasets = db.datasets
    data_columns = db.data_columns


class UserService:
    @staticmethod
    def create(user: User) -> User:
        try:
            user.password = sha256_crypt.encrypt(user.password)
            obj_id = Base.users.insert_one(user.get_dict()).inserted_id
            # user.token = UserService.generate_auth_token(obj_id).decode("utf-8")
            # Base.db.users.update_one({'_id': obj_id}, {'$set': {'token': user.token}}, upsert=False)
            return user
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def get(email: str, user_id: ObjectId = None) -> User:
        user = Base.users.find_one({"_id": user_id} if user_id else {"email": email})

        return User.get_model(user)

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
    def generate_auth_token(expiration=600):
        s = Serializer(SECRET_KEY, expires_in=expiration)
        salt = b64encode(os.urandom(24)).decode('utf-8')

        return s.dumps({'id': salt})

    @staticmethod
    def verify_auth_token(token) -> bool:
        s = Serializer(SECRET_KEY)
        try:
            data = s.loads(token)
        except SignatureExpired as e:
            print(e)
            return False  # valid token, but expired
        except BadSignature as e:
            print(e)
            return False  # invalid token
        return True
