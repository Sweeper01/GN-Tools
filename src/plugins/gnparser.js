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
        input = " " + input + " "

        let scans = []

        let inputs = input.split("Galaxy-Network")

        for (let i = 1; i < inputs.length; i += 2) {
            scans.push(inputs[i])
        }

        for (let s = 0; s < scans.length; s++) {
            let scan = scans[s]
            let lines = scan.split(/\r?\n/)

            // Header
            // Galaxy-Network MiliScan (100%) Sweeper (9:1)
            let header = lines[0].trim().split(' ')
            let type = header[0].toLowerCase()
            result.name = header[2]
            let cords = header[3].replace('(', '').replace(')', '').split(':')
            result.galaxy = cords[0]
            result.nr = cords[1]
            result.id = header[2] + '§' + cords[0] + '§' + cords[1]

            console.log(type)
            // MILISCAN
            if (type == 'miliscan') {
                // Im Orbit: 20 Jäger - 1000 Bomber - 500 Träger - 2000 Cancris
                // Flotte 1:  200000  Bomber  200  Zerstörer  20000  Träger  20000  Cancris  <Im Orbit>
                // Flotte 2:  35508  Kleptoren  <Im Orbit>
                if (lines[1].length > 0) {
                    result.fleet[0].units = this.getShipsFromMili(lines[1])
                }
                if (lines[2].length > 0) {
                    result.fleet[1].units = this.getShipsFromMili(lines[2])
                }
                if (lines[3].length > 0) {
                    result.fleet[2].units = this.getShipsFromMili(lines[3])
                }
            }

            if (type == 'geschützscan') {
                // Rubium: 1080000 - Pulsar: 150000 - Coon: 30000 - Centurion: 12000 - Horus: 1050000
                if (lines[1].length > 0) {
                    result.orb = this.getOrbFromGscan(lines[1])
                }

            }

            if (type == 'sektorscan') {
                //M-Extraktoren: 19534 - K-Extraktoren: 3700
                console.log(lines[3])
                if (lines[3] && lines[3].length > 0) {
                    result.exen = this.getExenFromSektor(lines[3])
                }
            }
        }

        console.warn("result", result)
        return result
    },

    getShipsFromMili: function (line) {
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
            let unit = CONFIG.MAP[name.toLowerCase()]
            if (!unit) {
                throw "Fehler beim Parsen: Einheit (" + name + ") konnte nicht gefunden werden!"
            }
            result[unit] = parseInt(ships[i], 10)
        }

        return result;
    },
    getOrbFromGscan: function (line) {
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
            result[unit] = parseInt(orb[i + 1], 10)
        }

        return result;
    },
    getExenFromSektor: function (line) {
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
            result[unit] = parseInt(exen[i + 1], 10)
        }

        return result;
    }
}
