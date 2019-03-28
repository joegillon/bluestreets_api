import sqlite3
from utils.match import MatchLib


def do_it():
    sql = 'SELECT * FROM contacts'
    contacts = cursor.execute(sql).fetchall()
    for contact in contacts:
        if contact[9] == '':
            continue
        # username = contact[9].split('@')[0]
        metaphone = MatchLib.get_single(contact[9])
        sql = "UPDATE contacts SET email_metaphone='%s' WHERE id=%d" % (metaphone, contact[0])
        cursor.execute(sql)
        db.commit()


if __name__ == '__main__':
    db = sqlite3.connect('c:/bench/bluestreets/data/26161.db')
    cursor = db.cursor()
    do_it()
