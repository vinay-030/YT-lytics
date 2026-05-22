from .database import db
import datetime

class APICache(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(255), unique=True, nullable=False)
    data = db.Column(db.JSON, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    @classmethod
    def get_cached(cls, key, max_age_hours=1):
        record = cls.query.filter_by(key=key).first()
        if record:
            age = datetime.datetime.utcnow() - record.timestamp
            if age.total_seconds() < (max_age_hours * 3600):
                return record.data
            else:
                db.session.delete(record)
                db.session.commit()
        return None
        
    @classmethod
    def set_cache(cls, key, data):
        record = cls.query.filter_by(key=key).first()
        if record:
            record.data = data
            record.timestamp = datetime.datetime.utcnow()
        else:
            record = cls(key=key, data=data)
            db.session.add(record)
        db.session.commit()
