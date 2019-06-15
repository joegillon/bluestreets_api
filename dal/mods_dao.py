def get_all(dao):
    sql = "SELECT * FROM modifications"
    return dao.execute(sql)
