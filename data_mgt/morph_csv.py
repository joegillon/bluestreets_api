import csv


def execute():
    csv_infile = open('c:/bench/bluestreets/data/6_8_19.csv', 'r')
    rdr = csv.reader(csv_infile)
    csv_flds = next(rdr)

    csv_outfile = open('c:/bench/bluestreets/data/6_8_19_corrected.csv', 'w', newline='')
    wtr = csv.writer(csv_outfile)
    wtr.writerow([
        'Last', 'First', 'Email', 'Phone1', 'Address', 'Zip',
        'Jurisdiction', 'Ward', 'Precinct', 'Groups'
    ])

    for inrow in rdr:
        grps = ''
        if inrow[0]:
            grps = groups[inrow[0].upper()]
        if inrow[1]:
            grps += ';' + groups[inrow[1].upper()]
        wtr.writerow([
            inrow[2], inrow[3], inrow[4], inrow[5], inrow[7], inrow[9],
            jurisdictions[inrow[8].upper()], inrow[10],
            inrow[11], grps
        ])

    csv_infile.close()
    csv_outfile.close()


def map_jurisdictions():
    return {
        'ANN ARBOR': 'AAC',
        'MANCHESTER': 'MAN',
        'WEBSTER TOWNSHIP': 'WEB',
        'YPSILANTI': 'YPC',
        'PITTSFIELD TWP': 'PIT',
        'PITTSFIELD TOWNSHIP': 'PIT',
        'CHELSEA': 'CHE',
        'ANN ARBOR TOWNSHIP': 'AAT',
        'SCIO TOWNSHIP': 'SCI',
        'LODI TOWNSHIP': 'LOD',
        'SALINE': 'SAC',
        'SUPERIOR TOWNSHIP': 'SUP',
        'PITTSFIELD (PRECINCT 9)': 'PIT',
        'YPSILANTI TOWNSHIP': 'YPT',
        'ANN ARBOR, CITY OF': 'AAC',
        'ANN ARBOR, TWP': 'AAT',
        'AUGUSTA TWP': 'AUG',
        'BRIDGEWATER TWP': 'BRI',
        'CHELSEA, CITY OF': 'CHE',
        'DEXTER TWP': 'DXT',
        'DEXTER, CITY OF': 'DXC',
        'DEXTER': 'DXC',
        'FREEDOM TWP': 'FRE',
        'LIMA TWP': 'LIM',
        'LODI TWP': 'LOD',
        'LYNDON TWP': 'LYN',
        'MANCHESTER TWP': 'MAN',
        'NORTHFIELD TWP': 'NOR',
        'SALEM TWP': 'SLM',
        'SALINE, CITY OF': 'SAC',
        'SCIO TWP': 'SCI',
        'SHARON TWP': 'SHA',
        'SUPERIOR TWP': 'SUP',
        'SUPERIOR TWP.': 'SUP',
        'SYLVAN TWP': 'SYL',
        'WEBSTER TWP': 'WEB',
        'YORK TWP': 'YOR',
        'YORK': 'YOR',
        'YPSILANTI TWP': 'YPT',
        'YPSILANTI, CITY OF': 'YPC',
        'CHELSEA/SYLVAN TWP': 'CHE',
        'ANN ARBOR (CITY)': 'AAC',
        'YPSILANTI CHARTER TOWNSHIP': 'YPT',
        'SCIO': 'SCI',
        'SUPERIOR TWP (YPSI MAILING)': 'SUP'
    }


def map_groups():
    return {
        'PRECINCT DELEGATE': 'PD',
        'CANVASSER': 'CNV18',
        'PHONEBANK': 'PH18',
        'TEXTBANK': 'TXT18',
        'POLL GREETER': 'GRT18',
        'RIDE TO THE POLLS': 'DRV18',
        'VOTER GUIDE': 'VG18',
        'VOTER GUIDES': 'VG18'
    }

if __name__ == '__main__':
    jurisdictions = map_jurisdictions()
    groups = map_groups()

    execute()
