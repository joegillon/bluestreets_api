def get_all(dao):
    sql = "SELECT * FROM jurisdictions ORDER BY name"
    return dao.execute(sql)
