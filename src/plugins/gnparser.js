/* eslint-disable */
import CONFIG from '@/config.json'

export default {

    // *Galaxy-Network SektorScan (100%) Ash 9:2*
    // Punkte: 34.577.577.383
    // Schiffe: 307000 - Verteidigung: 2322000
    // M-Extraktoren: 19534 - K-Extraktoren: 3700
    // Asteroiden: 1200
    // *Gescannt von Sweeper (9:1) (300 SVs)*

    // 00,14Galaxy-Network SektorScan (01,14100%00,14) Ash (01,149:200,14)
    // 01,15Punkte:        00,1434.577.577.383
    // 01,15Schiffe:               00,1430700001,15 Verteidigung:      00,142322000
    // 01,15M-Extraktoren:          00,141953401,15 K-Extraktoren:        00,143700
    // 01,15Asteroiden:           00,141200
    // 00,14Galaxy-Network SektorScan (01,14300 SVs00,14) Sweeper (01,149:100,14)

    // *Galaxy-Network MiliScan (100%) Sweeper (9:1)*
    // *Im Orbit:* 
    // *Flotte 1:* 200000 Bomber - 200 Zerstörer - 20000 Träger - 20000 Cancris <Im Orbit>
    // *Flotte 2:* 35508 Kleptoren <Im Orbit>
    // *Gescannt von Sweeper (9:1) (300 SVs)*

    // 00,14Galaxy-Network MiliScan (01,14100%00,14) Sweeper (01,149:100,14)
    // 01,15Im Orbit: 
    // 01,15Flotte 1: 00,14 200000 01,15 Bomber 00,14 200 01,15 Zerstörer 00,14 20000 01,15 Träger 00,14 20000 01,15 Cancris  00,14<Im Orbit>
    // 01,15Flotte 2: 00,14 35508 01,15 Kleptoren  00,14<Im Orbit>
    // 00,14Galaxy-Network MiliScan (01,14300 SVs00,14) Sweeper (01,149:100,14)

    // *Galaxy-Network GeschützScan (100%) Ash (9:2)*
    // Rubium: 1080000 - Pulsar: 150000 - Coon: 30000 - Centurion: 12000 - Horus: 1050000
    // *Gescannt von Sweeper (9:1) (300 SVs)*

    // 00,14Galaxy-Network GeschützScan (01,14100%00,14) Ash (01,149:200,14)
    // 01,15Rubium 00,14108000001,15 01,15Pulsar 00,1415000001,15 01,15Coon 00,143000001,15 01,15Centurion 00,141200001,15 01,15Horus 00,14105000001,15 
    // 00,14Galaxy-Network GeschützScan (01,14300 SVs00,14) Sweeper (01,149:100,14)


    parse: function (input, result) {
        let _this = this

        console.warn("before:", input)

        //WhatsApp Parse Bereinigen
        input = input.replaceAll('*', '')

        //IRC Parse Bereinigen
        input = input.replaceAll('00,14 ', '')
        input = input.replaceAll('00,14', '')
        input = input.replaceAll('01,14', '')
        // input = input.replaceAll('01,15 ', '') - macht Gscan kaputt
        input = input.replaceAll('01,15', '')
        input = input.replaceAll('Gescannt von', 'Galaxy-Network')

        input = input.trim()

        let lines = input.split(/\r?\n/)
        lines = lines.filter(e => e.trim().length > 0);
        let scans = []
        let parses = []
        // let inputs = input.split("Galaxy-Network")

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];

            if (line.toLowerCase().includes("miliscan")) {
                scans.push({
                    type: "miliscan",
                    lines: lines.slice(index, index + 4)
                })
                index = index + 4
            }
            if (line.toLowerCase().includes("einheitenscan")) {
                scans.push({
                    type: "einheitenscan",
                    lines: lines.slice(index, index + 4)
                })
                index = index + 4
            }
            if (line.toLowerCase().includes("geschützscan")) {
                scans.push({
                    type: "geschützscan",
                    lines: lines.slice(index, index + 2)
                })
                index = index + 2
            }
            if (line.toLowerCase().includes("sektorscan")) {
                scans.push({
                    type: "sektorscan",
                    lines: lines.slice(index, index + 5)
                })
                index = index + 5
            }
            if (line.toLowerCase().includes("flottenzusammensetzung")) {
                parses.push({
                    type: "flottenzusammensetzung",
                    lines: lines.slice(index, index + 11)
                })
                index = index + 10
            }
            if (line.toLowerCase().includes("verteidigungseinheiten")) {
                parses.push({
                    type: "verteidigungseinheiten",
                    lines: lines.slice(index, index + 7)
                })
                index = index + 6
            }
        }

        // lines.forEach((input) => {
        //     input = input.filter(e => e.trim().length > 0);           
        //     scans.push(input)
        // })

        scans.forEach((scan) => {
            // let scan = scans[s]
            let lines = scan.lines
            let type = scan.type

            // Header
            // Galaxy-Network MiliScan (100%) Sweeper (9:1)
            let headerline = lines[0].trim().split('Galaxy-Network')
            let header = headerline[1].trim().split(' ')
            result.name = header[2]
            let cords = header[3].replace('(', '').replace(')', '').split(':')
            result.galaxy = cords[0]
            result.nr = cords[1]
            result.id = header[2] + '§' + cords[0] + '§' + cords[1]

            // MILISCAN
            if (type == 'miliscan') {
                if (lines[1].length > 0) {
                    result.fleet[0].units = _this.getShipsFromMili(lines[1])
                }
                if (lines[2].length > 0) {
                    result.fleet[1].units = _this.getShipsFromMili(lines[2])
                }
                if (lines[3].length > 0) {
                    result.fleet[2].units = _this.getShipsFromMili(lines[3])
                }
            }

            // UNITSCAN
            if (type == 'einheitenscan') {
                if (lines[1].length > 0 &&
                    lines[2].length > 0 &&
                    lines[3].length > 0) {
                    result.fleet[1].units = _this.getShipsFromUnit(lines[1], lines[2], lines[3])
                }

            }

            if (type == 'geschützscan') {
                if (lines[1].length > 0) {
                    result.orb = _this.getOrbFromGscan(lines[1])
                }
            }

            if (type == 'sektorscan') {
                if (lines[3] && lines[3].length > 0) {
                    result.points = _this.getPointsFromSektor(lines[1])
                    result.exen = _this.getExenFromSektor(lines[3])
                }
            }
        })

        parses.forEach((parse) => {
            let lines = parse.lines
            let type = parse.type

            if (type == 'flottenzusammensetzung') {
                // Flottenzusammensetzung von Sweeper (7:1)    	
                // Schiffstyp 	Orbit 	Flotte 1 	Flotte 2
                // Jäger:	0	0	0
                // Bomber:	242	9758	0
                // Fregatte:	528	1272	0
                // Zerstörer:	6	94	50
                // Kreuzer:	8	192	0
                // Schlachtschiff:	0	0	0
                // Trägerschiff:	0	134	0
                // Kaperschiff:	216	0	14784
                // Schutzschiff:	12000	0	0

                // Header
                // Flottenzusammensetzung von Sweeper (7:1)
                let header = lines[0].trim().split(' ')
                result.name = header[2]
                let cords = header[3].replace('(', '').replace(')', '').split(':')
                result.galaxy = cords[0]
                result.nr = cords[1]
                result.id = header[2] + '§' + cords[0] + '§' + cords[1]

                for (let index = 2; index < lines.length; index++) {
                    let line = lines[index];

                    line = line.replaceAll(':', '')
                    line = line.replaceAll('\t', ' ')
                    line = line.trim()

                    let ships = line.split(' ')

                    ships = ships.filter(e => e.trim().length > 0);

                    let name = ships[0]
                    let unit = CONFIG.MAP[name.toLowerCase()]
                    if (!unit) {
                        throw "Fehler beim Parsen: Einheit (" + name + ") konnte nicht gefunden werden!"
                    }

                    for (let fleetIndex = 0; fleetIndex < ships.length - 1 || fleetIndex <= 2; fleetIndex++) {
                        let ship = parseInt(ships[fleetIndex + 1]);
                        if (ship > 0) {
                            result.fleet[fleetIndex].units[unit] = ship
                        }
                    }
                }
            }

            if (type == 'verteidigungseinheiten') {
                // Verteidigungseinheiten    	
                // Einheitentyp 	Anzahl
                // Leichtes Orbitalgeschütz "Rubium":	0
                // Leichtes Raumgeschütz "Pulsar":	0
                // Mittleres Raumgeschütz "Coon":	0
                // Schweres Raumgeschütz "Centurion":	0
                // Abfangjäger "Horus":	150

                for (let index = 2; index < lines.length; index++) {
                    let line = lines[index];

                    line = line.replaceAll(':', '')
                    line = line.replaceAll('\t', ' ')
                    line = line.replaceAll(' ', '')
                    line = line.trim()

                    let orbs = line.split('"')

                    orbs = orbs.filter(e => e.trim().length > 0);

                    let name = orbs[1]
                    let unit = CONFIG.MAP[name.toLowerCase()]
                    if (!unit) {
                        throw "Fehler beim Parsen: Einheit (" + name + ") konnte nicht gefunden werden!"
                    }

                    let orb = parseInt(orbs[2]);
                    if (orb > 0) {
                        result.orb[unit] = orb
                    }
                }
            }
        })

        console.warn("result", result)
        return result
    },
    getShipsFromUnit: function (line1, line2, line3) {
        // Kleptoren: 11511 - Cancris: 12000 - Fregatten: 500
        // Zerstörer: 342 - Kreuzer: 100 - Träger: 99
        // Jäger: 3104 - Bomber: 0 - Schlachter: 274

        let line = line1 + ' ' + line2 + ' ' + line3
        //Cleanup
        line = line.replaceAll('-', '')
        line = line.replaceAll(':', '')
        line = line.trim()

        let result = {}
        let ships = line.split(' ')

        ships = ships.filter(e => e.trim().length > 0);

        for (let i = 0; i + 1 < ships.length; i += 2) {
            let name = ships[i]
            let amount = ships[i + 1]
            let unit = CONFIG.MAP[name.toLowerCase()]
            if (!unit) {
                throw "Fehler beim Parsen: Einheit (" + name + ") konnte nicht gefunden werden!"
            }
            if (amount > 0) {
                result[unit] = parseInt(amount)
            }
        }

        return result;
    },
    getShipsFromMili: function (line) {
        // Im Orbit: 20 Jäger - 1000 Bomber - 500 Träger - 2000 Cancris
        // Flotte 1:  200000  Bomber  200  Zerstörer  20000  Träger  20000  Cancris  <Im Orbit>
        // Flotte 2:  35508  Kleptoren  <Im Orbit>

        //Cleanup
        line = line.replace('Im Orbit:', '')
        line = line.replace('Flotte 1:', '')
        line = line.replace('Flotte 2:', '')
        line = line.replaceAll('-', '')
        line = line.split('<')[0]
        line = line.trim()

        let result = {}
        let ships = line.split(' ')

        ships = ships.filter(e => e.trim().length > 0);

        for (let i = 0; i + 1 < ships.length; i += 2) {
            let name = ships[i + 1]
            let amount = ships[i]
            let unit = CONFIG.MAP[name.toLowerCase()]
            if (!unit) {
                throw "Fehler beim Parsen: Einheit (" + name + ") konnte nicht gefunden werden!"
            }
            if (amount > 0) {
                result[unit] = parseInt(amount)
            }
        }

        return result;
    },
    getOrbFromGscan: function (line) {
        // Rubium: 1080000 - Pulsar: 150000 - Coon: 30000 - Centurion: 12000 - Horus: 1050000

        //Cleanup
        line = line.replaceAll('- ', '')
        line = line.replaceAll(':', '')
        line = line.trim()

        let result = {}
        let orb = line.split(' ')

        orb = orb.filter(e => e.trim().length > 0);

        for (let i = 0; i + 1 < orb.length; i += 2) {
            let name = orb[i]
            let unit = CONFIG.MAP[name.toLowerCase()]
            if (!unit) {
                throw "Fehler beim Parsen: Einheit (" + name + ") konnte nicht gefunden werden!"
            }
            result[unit] = parseInt(orb[i + 1])
        }

        return result;
    },
    getPointsFromSektor: function (line) {
        //Punkte: 78.998.101

        //Cleanup
        line = line.replaceAll('- ', '')
        line = line.replaceAll(':', '')
        line = line.replaceAll('.', '')
        line = line.trim()

        let points = line.split(' ')

        return points[1]
    },
    getExenFromSektor: function (line) {
        //M-Extraktoren: 19534 - K-Extraktoren: 3700

        //Cleanup
        line = line.replaceAll('- ', '')
        line = line.replaceAll(':', '')
        line = line.replaceAll('          ', ' ')
        line = line.trim()

        let result = {}
        let exen = line.split(' ')

        exen = exen.filter(e => e.trim().length > 0);

        for (let i = 0; i + 1 < exen.length; i += 2) {
            let name = exen[i]
            let unit = CONFIG.MAP[name.toLowerCase()]
            if (!unit) {
                throw "Fehler beim Parsen: Einheit (" + name + ") konnte nicht gefunden werden!"
            }
            result[unit] = parseInt(exen[i + 1])
        }

        return result;
    }
}
