def is_in_turf(rec, block):
    return is_same_street(rec, block) and \
        is_in_block(rec, block) and \
        is_side_of_street(rec, block)


def is_same_street(rec, block):
    return rec['street_name'] == block['street_name'] and \
            rec['street_type'] == block['street_type']


def is_in_block(rec, block):
    if not block['low_addr']:
        return True
    return rec['house_number'] in range(block['low_addr'], block['high_addr'] + 1)


def is_side_of_street(rec, block):
    x = rec['house_number'] % 2
    switcher = {
        'B': True,
        'E': x == 0,
        'O': x == 1
    }
    return switcher[block['odd_even']]


