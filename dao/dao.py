class Dao(object):

    def __init__(self, db_file=None, stateful=None):
        import sqlite3
        from flask import current_app as app

        if db_file:
            self.db = sqlite3.connect(db_file)
        else:
            self.db = sqlite3.connect(app.config['DB_PATH'])
        self.__cursor = self.db.cursor()
        self.__sql = ''
        self.__params = []
        self.__id_fld = None
        self.__stateful = stateful

    def execute(self, sql, params=None, id_fld=None):
        self.__sql = sql
        self.__params = params
        self.__id_fld = id_fld
        op = self.__sql.split(' ', 1)[0].upper()
        if op == 'SELECT':
            result = self.__query()
        elif op == 'INSERT':
            result = self.__add()
        elif op == 'UPDATE':
            result = self.__update()
        elif op == 'DELETE':
            result = self.__drop()
        elif op == 'PRAGMA':
            return self.__cursor.execute(sql)
        else:
            result = []
        if self.__stateful:
            return result
        self.db.close()
        return result

    def __query(self):
        if self.__params:
            n = self.__cursor.execute(self.__sql, self.__params)
        else:
            n = self.__cursor.execute(self.__sql)
        if not n:
            return []
        rex = self.__cursor.fetchall()
        flds = [d[0] for d in self.__cursor.description]
        rex = [dict(zip(flds, rec)) for rec in rex] if rex else []
        if self.__id_fld:
            return {rec[self.__id_fld]: rec for rec in rex}
        else:
            return rex

    def __add(self):
        self.__cursor.execute(self.__sql, self.__params)
        self.db.commit()
        return self.__cursor.lastrowid

    def __update(self):
        self.__cursor.execute(self.__sql, self.__params)
        self.db.commit()
        return 1

    def __drop(self):
        self.__cursor.execute(self.__sql, self.__params)
        self.db.commit()
        return 1

    def close(self):
        self.db.close()

    def add_many(self, tbl, flds, values):
        sql = "INSERT INTO %s (%s) VALUES (%s);" % (
            tbl, ','.join(flds), Dao.get_param_str(flds)
        )
        self.__cursor.executemany(sql, values)
        self.db.commit()

    def update_many(self, tbl, flds, values):
        sql = "UPDATE %s SET %s WHERE id=?" % (
            tbl, '=?,'.join(flds) + '=?')
        self.__cursor.executemany(sql, values)
        self.db.commit()

    def drop_many(self, tbl, ids):
        sql = "DELETE FROM %s WHERE id IN (%s);" % (tbl, Dao.get_param_str(ids))
        self.__cursor.execute(sql, ids)
        self.db.commit()

    def get_max_id(self, tbl, id_fld):
        sql = "SELECT MAX(%s) FROM %s;" % (id_fld, tbl)
        value = self.db.cursor().execute(sql).fetchone()[0]
        return value if value else 0

    @staticmethod
    def get_param_str(lst):
        return ('?,' * len(lst))[0:-1]

    def transaction(self, sqls):
        self.db.isolation_level = None
        try:
            self.__cursor.execute('BEGIN')
            for sql in sqls:
                self.__cursor.execute(sql)
            self.__cursor.execute('COMMIT')
            return True
        except self.db.error:
            self.__cursor.execute('ROLLBACK')
            return False


def get_dao(f):
    def f_with_dao(*args, **kwargs):
        if not args or type(args[0]) is not Dao:
            args = (Dao(),) + args
        return f(*args, **kwargs)
    return f_with_dao
