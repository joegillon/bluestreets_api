# import modules
import re
from operator import itemgetter


def sort_streets(street_list):
    """
    Sort streets alphabetically, ignoring cardinal direction prefixes such as North, South, East and West
    :param street_list: list of street names
    """
    # compile a sorted list to extract the direction prefixes and street root from the street string
    # created using https://regex101.com/#python
    regex = re.compile(
        r'(?P<prefix>^North\w*\s|^South\w*\s|^East\w*\s|^West\w*\s|^N\.?\s|^S\.?\s|^E\.?\s|^W\.?\s)?(?P<street>.*)',
        re.IGNORECASE
    )

    # list to store tuples for sorting
    street_sort_list = []

    # for every street
    for street in street_list:

        # just in case, strip leading and trailing whitespace
        street = street.strip()

        # extract the prefix and street using regular expression matching
        street_match = regex.search(street)

        # convert both the returned strings to lowercase
        if street_match.group('prefix'):
            street_prefix = street_match.group('prefix')

        street_root = street_match.group('street')

        # place the prefix, street extract and full street string in a tuple and add it to the list
        street_sort_list.append((street_prefix, street_root, street))

    # sort the streets first on street name, and second with the prefix to address duplicates
    street_sort_list.sort(key=itemgetter(1, 0), reverse=False)

    # return just a list of sorted streets, using a list comprehension to pull out the original street name in order
    return [street_tuple[2] for street_tuple in street_sort_list]
