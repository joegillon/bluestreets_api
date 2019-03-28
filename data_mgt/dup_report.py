import sqlite3
from utils.match import get_suspects

matched_ids = []
identity_flds = ['id', 'last', 'first', 'middle', 'nickname', 'gender', 'birth_year']


def find_email_matches():
    global matched_ids
    flds = identity_flds + ['email', 'email_metaphone']
    sql = 'SELECT %s FROM contacts' % ','.join(flds)
    contacts = query(sql)
    for contact in contacts:
        if contact['id'] in matched_ids or contact['email'] == '':
            continue
        sql = ("SELECT %s "
               "FROM contacts "
               "WHERE id <> ? "
               "AND email_metaphone=?") % ','.join(flds)
        vals = (contact['id'], contact['email_metaphone'])
        candidates = query(sql, vals)
        if candidates:
            target = contact['email']
            ids = {contact['id']: []}
            d = {c['id']: c for c in candidates}
            suspects = get_suspects(target, candidates, 'email', 90)
            if suspects:
                matches = [suspect for suspect in suspects if is_match(contact, d[suspect])]
                if matches:
                    ids[contact['id']] = matches
                    matched_ids += ([contact['id']] + matches)
                    rpt['email_matches'].append(ids)


def find_phone_matches():
    global matched_ids
    flds = identity_flds + ['phone1', 'phone2']
    sql = 'SELECT %s FROM contacts' % ','.join(flds)
    contacts = query(sql)
    for contact in contacts:
        if contact['id'] in matched_ids:
            continue
        phones = []
        if contact['phone1']:
            phones.append(contact['phone1'])
        if contact['phone2']:
            phones.append(contact['phone2'])
        if not phones:
            continue
        phonestr = ','.join(phones)
        sql = ("SELECT %s "
               "FROM contacts "
               "WHERE id <> ? "
               "AND (phone1 IN (?) "
               "OR phone2 IN (?))") % ','.join(flds)
        vals = (contact['id'], phonestr, phonestr)
        candidates = query(sql, vals)
        if candidates:
            matches = [c for c in candidates if is_match(contact, c)]
            if matches:
                ids = {contact['id']: [m['id'] for m in matches]}
                matched_ids += [contact['id']] + ids[contact['id']]
                rpt['phone_matches'].append(ids)


def find_name_addr_matches():
    global matched_ids
    flds = identity_flds + ['name_metaphone', 'street_name', 'street_metaphone']
    sql = "SELECT %s FROM contacts" % ','.join(flds)
    contacts = query(sql)
    for contact in contacts:
        if contact['id'] in matched_ids or contact['street_name'] == '':
            continue
        sql = ("SELECT %s "
               "FROM contacts "
               "WHERE id <> ? "
               "AND name_metaphone=? "
               "AND last LIKE ? "
               "AND street_metaphone=?") % ','.join(flds)
        vals = (
            contact['id'],
            contact['name_metaphone'],
            contact['last'][0] + '%',
            contact['street_metaphone'])
        candidates = query(sql, vals)
        if candidates:
            ids = {contact['id']: []}
            target = contact['street_name']
            d = {c['id']: c for c in candidates}
            suspects = get_suspects(target, candidates, 'street_name', 90)
            if suspects:
                matches = [suspect for suspect in suspects if is_match(contact, d[suspect])]
                if matches:
                    ids[contact['id']] = matches
                    matched_ids += ([contact['id']] + matches)
                    rpt['name_addr_matches'].append(ids)


def is_match(contact1, contact2):
    from fuzzywuzzy import fuzz

    if contact1['birth_year'] and contact2['birth_year']:
        if contact1['birth_year'] != contact2['birth_year']:
            return False

    if contact1['gender'] and contact2['gender']:
        if contact1['gender'] != contact2['gender']:
            return False

    if contact1['middle'] and contact2['middle']:
        name1 = '%s, %s %s' % (
            contact1['last'], contact1['first'], contact1['middle']
        )
        name2 = '%s, %s %s' % (
            contact2['last'], contact2['first'], contact2['middle']
        )
        if fuzz.ratio(name1, name2) >= 80:
            return True

    name1 = '%s, %s' % (contact1['last'], contact1['first'])
    name2 = '%s, %s' % (contact2['last'], contact2['first'])
    score1 = fuzz.ratio(name1, name2)

    score2 = 0
    if contact1['nickname'] and contact2['nickname']:
        name1 = '%s, %s' % (contact1['last'], contact1['nickname'])
        name2 = '%s, %s' % (contact2['last'], contact2['nickname'])
        score2 = fuzz.ratio(name1, name2)

    score = max([score1, score2])
    return score >= 80


def query(sql, params=None):
    if params:
        n = cursor.execute(sql, params)
    else:
        n = cursor.execute(sql)
    if not n:
        return []
    rex = cursor.fetchall()
    flds = [d[0] for d in cursor.description]
    return [dict(zip(flds, rec)) for rec in rex] if rex else []


def write_report():
    import csv

    with open('duplicate_report.csv', 'w', newline='') as csvfile:
        wtr = csv.writer(csvfile)
        for match in rpt['email_matches']:
            k = str(list(match.keys())[0])
            v = ','.join(str(x) for x in list(match.values())[0])
            wtr.writerow([k, v])

if __name__ == '__main__':
    db = sqlite3.connect('c:/bench/bluestreets/data/26161.db')
    cursor = db.cursor()
    rpt = {
        'email_matches': [],
        'phone_matches': [],
        'name_addr_matches': []
    }

    find_email_matches()
    find_phone_matches()
    find_name_addr_matches()
    # find_name_only_matches()
    write_report()
