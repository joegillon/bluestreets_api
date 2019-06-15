def get_all(dao, with_groups=False):
    if with_groups:
        sql = ("SELECT c.*, m.group_id, m.role, m.comment "
               "FROM contacts as c "
               "JOIN memberships as m ON m.contact_id=c.id")

    else:
        sql = "SELECT * FROM contacts"
    sql += " ORDER BY c.last_name, c.first_name, c.middle_name;"
    return dao.execute(sql)
