def whole_name(last, first, middle):
    return ('%s, %s %s' % (last, first, middle)).strip()


def street_addr(num, pre, name, type, suf, unit):
    s = '%s %s' % (str(num), get_street(pre, name, type, suf))
    if unit:
        s += ' Unit %s' % unit
    return s


def get_street(pre, name, type, suf):
    s = ''
    if pre:
        s += ' %s' % pre
    s += ' %s' % name
    if type:
        s += ' %s' % type
    if suf:
        s += ' %s' % suf
    return s.strip()


def to_display(rec):
    rec['name'] = whole_name(
        rec['last_name'], rec['first_name'], rec['middle_name'])
    rec['address'] = street_addr(
        rec['house_number'],
        rec['pre_direction'],
        rec['street_name'],
        rec['street_type'],
        rec['suf_direction'],
        rec['unit']
    )
    return rec
