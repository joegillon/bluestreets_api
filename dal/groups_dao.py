def get_all(dao, with_members=False):
    if with_members:
        memflds = 'm.id AS mem_id, m.contact_id, m.role, m.comment'
        conflds = '(c.last_name || ", " || c.nickname) AS contact_name'
        sql = ("SELECT g.*, %s, %s "
               "FROM groups g "
               "LEFT JOIN memberships m ON m.group_id=g.id "
               "LEFT JOIN contacts c ON m.contact_id=c.id;") % (memflds, conflds)
        rex = dao.execute(sql)
        d = {}
        for rec in rex:
            if rec['id'] not in d:
                d[rec['id']] = {
                    'id': rec['id'],
                    'name': rec['name'],
                    'code': rec['code'],
                    'description': rec['description'],
                    'created_at': rec['created_at'],
                    'updated_at': rec['updated_at'],
                    'members': []
                }
            if rec['contact_id']:
                d[rec['id']]['members'].append({
                    'id': rec['mem_id'],
                    'contact_id': rec['contact_id'],
                    'contact_name': rec['contact_name'],
                    'role': rec['role'],
                    'comment': rec['comment']
                })
        return list(d.values())
    else:
        sql = 'SELECT * FROM groups ORDER BY name'
    return dao.execute(sql)


def add(dao, d):
    sql = ("INSERT INTO groups "
           "(name, code, description) "
           "VALUES (?,?,?)")
    vals = [d['name'], d['code'], d['description']]
    return dao.execute(sql, vals)


def update(dao, d):
    sql = ("UPDATE groups "
           "SET name=?, code=?, description=? "
           "WHERE id=?;")
    vals = [d['name'], d['code'], d['description'], d['id']]
    return dao.execute(sql, vals)


def drop(dao, grp_id):
    sql = "DELETE FROM groups WHERE id=?"
    return dao.execute(sql, (grp_id,))


def add_member(dao, d):
    sql = ("INSERT INTO memberships "
           "(group_id, contact_id, role, comment) "
           "VALUES (?,?,?,?)")
    vals = [d['group_id'], d['contact_id'], d['role'], d['comment']]
    return dao.execute(sql, vals)


def update_member(dao, d):
    sql = ("UPDATE memberships "
           "SET role=?, comment=? "
           "WHERE id=?")
    vals = [d['role'], d['comment'], d['id']]
    return dao.execute(sql, vals)


def drop_member(dao, mem_id):
    sql = "DELETE FROM memberships WHERE id=?"
    return dao.execute(sql, (mem_id,))
