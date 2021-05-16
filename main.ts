function init_strip(snr: number, hwMatrix: number, pin: number) {
    arr_neop_settings[snr].pin = pin;
    arr_neop_settings[snr].hwMatrix = arr_tech_matrix[hwMatrix];

    hwx = arr_neop_settings[snr].hwMatrix[0];
    hwy = arr_neop_settings[snr].hwMatrix[1];

    let pixelAnzahl = arr_tech_matrix[hwMatrix][0] * arr_tech_matrix[hwMatrix][1]
    let strip = neopixel.create(arr_tech_pin[pin], pixelAnzahl, NeoPixelMode.RGB)
    neop_ges[snr] = strip

    strip.setBrightness(strip_helligkeit)
    strip.clear()
    strip.show()
    
    neo_strip_anzahl = Math.max(snr + 1, neo_strip_anzahl)

    
    // let xstrip: Array<neopixel.Strip>=[]
    let xstrip: neopixel.Strip[] =[]
    for (let z = 0; z < hwy; z++) {
        //zstrip[z] = neop_ges[snr].range(z * hwx, hwx)
        //strip_ranges[snr*hwx][z]=neop_ges[snr].range(z * hwx, hwx)
        // strip_ranges.push(neop_ges[snr].range(z * hwx, hwx))
        xstrip.push(neop_ges[snr].range(z * hwx, hwx))
        //strip_ranges[snr][z]=neop_ges[snr].range(z * hwx, hwx)
        //strip_ranges.push(neop_ges[snr].range(z * hwx, hwx))
//serial.writeLine("z" + xx[0])



    }
    strip_ranges.push(xstrip)

    let xx:neopixel.Strip[]
    for (let z = 0; z < hwy; z++) {
        xx=strip_ranges[snr]
        // console.log(snr+" "+xx[z].start+" bis "+xx.length())

    }
// serial.writeLine("snr" + snr)





// xx[0].setPixelColor(0, NeoPixelColors.Green);
// xx[0].show()



// strip_ranges[0][1].setPixelColor(12, NeoPixelColors.Blue);
// strip_ranges[0][1].show()

}


function set_punkt(snr:number=0,x: number, y:number, color: number) {
    hwx = arr_neop_settings[snr].hwMatrix[0];
    hwy = arr_neop_settings[snr].hwMatrix[1];
    //let px = (hwy-y-1)*hwy + ((y % 2) ? hwx-(x % hwx)-1:(x % hwx))
    let t= x 
    if ((y % 2)!=(hwy % 2)) {
       t=(hwx - 1 - x)
    }
    let px = (hwy-1-y) * hwx + t
    neop_ges[snr].setPixelColor(px, color);
    neop_ges[snr].show()
}

function set_system(sname: number) {
    if (sname == 0) {
        init_strip(0,2,0) //standard, 8x8,pin1 
        basic.showString("S")
    }

    if (sname == 1) { //wolf
        init_strip(0,1,0) //links, 7x5,pin0
        init_strip(1,1,1) //rechts, 7x5,pin1  
        basic.showString("M")
    }
    if (sname == 2) { //baatest
        // init_strip(0,2,0) //standard, 8x8,pin0 
        init_strip(0,2,1) //standard, 8x8,pin0 
        init_strip(1,2,2) //standard, 8x8,pin1 
//        init_strip(2,1,2) //standard, 5x7,pin2 
        basic.showString("B")
    }

}

function get_bst_matrix(zch: string = "A") {
    let found = bst_reihe.indexOf(zch)
    if (found==-1) {
        found=0;
    }
    return arr_zeichen[found]
}

function scrollen (zstrip: neopixel.Strip[]) {
    for (let strip = 0; strip < hwy; strip++) {
        let sh = (strip % 2) ? -1:1
        zstrip[strip].shift(sh)
    }
}
function get_ystreifen(zeichen_matrix:Array<number>,bit:number=0,x_add:number=0,color:number,zstrip:neopixel.Strip[] ) {
    zeichen_matrix.forEach(function (zahl, zeile) {
        if (zahl & Math.pow(2, bit)) {
            let b=bit+x_add
            let px=(zeile % 2) ? (hwx-1-b):b
            zstrip[zeile].setPixelColor(px, color)
            //neop_ges[0].setPixelColor(px, color)
            //console.log("z:"+zeile+"/"+px+ " "+zahl);
        }
    })
}
function frei_matrix(zch_str:string) {
    let ret="";
    let zch_len = zch_str.length
    if (zch_str.indexOf(";")>-1) {
        const arr_split = zch_str.split(";")
        arr_zeichen[80]=arr_split.map(wert => parseInt(wert));
        ret=";";
    };
    return ret
}    
  
let a_txt = ["","",""]  
function showtext (snr:number,txt:string="A",color:number,scroll_flag:boolean=false) {
    
    a_txt[snr]=txt    
music.playTone(Note.C, music.beat())
    hwx = arr_neop_settings[snr].hwMatrix[0];
    hwy = arr_neop_settings[snr].hwMatrix[1];
    // for (let neopixel.hsl(0, 0, 0) = 0; n <= hwy; n++) {
    //     //zstrip[n] = neop_ges[snr].range(n * hwx, hwx)
    //     strip_ranges[snr][n]=neop_ges[snr].range(n * hwx, hwx)
    //     //strip_ranges[1][n]=neop_ges[1].range(n * hwx, hwx)
    // }

    const center=Math.floor((hwx-zch_bit_breite)/2) 

    if (frei_matrix(txt)==";") {
        txt=";";
    }
    neop_ges[snr].clear()
    // let zstrip: neopixel.Strip[]=[]  

    // strip_ranges[snr]:neopixel.Strip[]=zstrip


    //strip_ranges[snr]=zstrip

    // let iii=0;
    // let int_snr=control.setInterval(function () {
        
    //     music.playTone(Note.C, music.beat())
    //     iii++
    //     if (iii>10) {
    //         serial.writeValue("snr", int_snr)
    //         control.clearInterval(int_snr, control.IntervalMode.Interval)
    //         iii=0;
    //     }
    // }, 4000, control.IntervalMode.Interval)


    for (let bst_pos = 0; bst_pos < a_txt[snr].length; bst_pos++) {
        if (!scroll_flag) {
            neop_ges[snr].clear()
        }
        
        
        const zeichen_matrix:Array<number>=get_bst_matrix(a_txt[snr][bst_pos])

let con=a_txt[snr] + "/" +a_txt[snr][bst_pos];
//console.log(con)
//serial.writeValue(con, snr)


        let str = zch_bit_breite;
        for (let s=str;s>=0;s--) {

            if (scroll_flag) {

                get_ystreifen(zeichen_matrix,s,-s,color,strip_ranges[snr])
                
                neop_ges[snr].show()
                basic.pause(pause_bst/10)
          
                scrollen(strip_ranges[snr])
            } else {
                get_ystreifen(zeichen_matrix,s,center,color,strip_ranges[snr])
                neop_ges[snr].show()
                //get_ystreifen(s,center,color,strip_ranges[1])
                
                //neop_ges[1].show()
                //basic.pause(80)

                // if (snr==0) {
                //     music.playTone(Note.G, music.beat())
                // }
                


            }
        }
        if (!scroll_flag) {
            neop_ges[snr].show()
            if (a_txt[snr].length>1) {
                basic.pause(pause_bst)
                //basic.pause(2000)
            }
        }    
    }
    if (hwx>zch_bit_breite) {
        neop_ges[snr].show()
    }
    music.playTone(Note.E, music.beat())
    //control.clearInterval(int_snr, control.IntervalMode.Interval)
}


function init_alphabet () {
    // bstreihenfolge einhalten
    //           123456789 123456789 123456789 1234567895123456789 123456789 123456789 123456789 123456789 
    bst_reihe = "? ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789!?+-.:=≠,*abcdefghijklmnopqrstuvwxyzäöü;"; //50+31

    arr_zeichen = [
        [14, 17, 1, 2, 4, 0, 4],
        [0, 0, 0, 0, 0, 0, 0],
        [14, 17, 17, 31, 17, 17, 17],
        [30, 17, 17, 30, 17, 17, 30],
        [14, 17, 16, 16, 16, 17, 14],
        [30, 17, 17, 17, 17, 17, 30],
        [31, 16, 16, 30, 16, 16, 31],
        [31, 16, 16, 30, 16, 16, 16],
        [14, 17, 16, 23, 17, 17, 14],
        [17, 17, 17, 31, 17, 17, 17],
        [14, 4, 4, 4, 4, 4, 14],
        [15, 2, 2, 2, 2, 18, 12],
        [17, 18, 20, 24, 20, 18, 17],
        [16, 16, 16, 16, 16, 16, 31],
        [17, 27, 21, 21, 17, 17, 17],
        [17, 17, 25, 21, 19, 17, 17],
        [14, 17, 17, 17, 17, 17, 14],
        [30, 17, 17, 30, 16, 16, 16],
        [14, 17, 17, 17, 21, 18, 13],
        [30, 17, 17, 30, 20, 18, 17],
        [14, 17, 16, 14, 1, 17, 14],
        [31, 4, 4, 4, 4, 4, 4],
        [17, 17, 17, 17, 17, 17, 14],
        [17, 17, 17, 17, 17, 10, 4],
        [17, 17, 17, 21, 21, 27, 17],
        [17, 17, 10, 4, 10, 17, 17],
        [17, 17, 10, 4, 4, 4, 4],
        [31, 1, 2, 4, 8, 16, 31],
        [10, 0, 4, 10, 17, 31, 17],
        [17, 14, 17, 17, 17, 17, 14],
        [17, 0, 17, 17, 17, 0, 14],
        [14, 17, 19, 21, 25, 17, 14],
        [4, 12, 4, 4, 4, 4, 14],
        [14, 17, 1, 2, 4, 8, 31],
        [31, 2, 4, 2, 1, 17, 14],
        [2, 6, 10, 18, 31, 2, 2],
        [31, 16, 30, 1, 1, 17, 14],
        [6, 8, 16, 30, 17, 17, 14],
        [31, 1, 2, 4, 4, 4, 4],
        [14, 17, 17, 14, 17, 17, 14],
        [14, 17, 17, 15, 1, 2, 12],
            [4, 4, 4, 4, 4, 0, 4],
            [14, 17, 1, 2, 4, 0, 4],
        [0, 4, 4, 31, 4, 4, 0], //+
        [0, 0, 0, 31, 0, 0, 0], //-
            [0, 0, 0, 0, 12, 12, 0],
            [0,12, 12, 0, 12, 12, 0],
        [0, 0, 30, 0, 30, 0, 0], //=
        [1, 2, 31, 4, 31, 8, 16],
        [0, 0, 0, 0, 4, 4, 4],  //,
            [0, 4, 21, 14, 21, 4, 0],
    [0, 0, 14, 1, 15, 17, 15],
    [16, 16, 22, 25, 17, 17, 14],
    [0, 0, 14, 16, 16, 17, 14],
    [1, 1, 13, 19, 17, 17, 15],
    [0, 0, 14, 17, 31, 16, 14],
    [2, 5, 4, 14, 4, 4, 4],
    [0, 0, 15, 17, 15, 1, 14],
    [16, 16, 22, 25, 17, 17, 17],
    [4, 0, 12, 4, 4, 4, 14],
    [2, 0, 2, 2, 2, 18, 12],
    [8, 8, 9, 10, 12, 10, 9],
    [12, 4, 4, 4, 4, 4, 14],
    [0, 0, 26, 21, 21, 21, 21],
    [0, 0, 22, 25, 17, 17, 17],
    [0, 0, 14, 17, 17, 17, 14],
    [0, 0, 30, 17, 30, 16, 16],
    [0, 0, 15, 17, 15, 1, 1],
    [0, 0, 11, 12, 8, 8, 8],
    [0, 0, 15, 16, 14, 1, 30],
    [4, 14, 4, 4, 4, 5, 2],
    [0, 0, 17, 17, 17, 19, 13],
    [0, 0, 17, 17, 17, 10, 4],
    [0, 0, 17, 17, 17, 21, 10],
    [0, 0, 25, 6, 4, 12, 19],
    [0, 0, 17, 9, 6, 4, 24],
    [0, 0, 31, 2, 4, 8, 31],
        [10, 0, 14, 1, 15, 17, 15],
        [10, 0, 0, 14, 17, 17, 14],
        [10, 0, 0, 17, 17, 17, 14],
        [0, 0, 0, 0, 0, 0, 0]
    ]

}

input.onButtonPressed(Button.AB, function () {
    for (let s=0;s<neo_strip_anzahl;s++) {
        neop_ges[s].clear()
        neop_ges[s].show()
    }
})

function loesche_matrix(snr: number=0) {
    neop_ges[snr].clear()
    neop_ges[snr].show()
}

// muss sein, damit der index nicht fehlläuft
function default_strip_data() {
    // for (let s=0;s<neo_strip_anzahl;s++) {
    //     arr_neop_settings.push({ pin: arr_tech_pin[s], hwMatrix: arr_tech_matrix[s] })
    // }    
    //nicht ändern, sonst geht das nicht mehr
    arr_neop_settings.push({ pin: arr_tech_pin[0], hwMatrix: arr_tech_matrix[2] })
    arr_neop_settings.push({ pin: arr_tech_pin[1], hwMatrix: arr_tech_matrix[2] })
    arr_neop_settings.push({ pin: arr_tech_pin[2], hwMatrix: arr_tech_matrix[1] })
}



function set_helligkeit(helligkeit: number, zch_pause: number) {
    strip_helligkeit = helligkeit;
    pause_bst = zch_pause;
    for (let i = 0; i < neo_strip_anzahl; i++) {
        neop_ges[i].setBrightness(strip_helligkeit);
    }
}
function testen() {
    // showtext (0,"1",neopixel.colors(NeoPixelColors.Red),true)
    // showtext (1,"2",neopixel.colors(NeoPixelColors.Red),true)
    // showtext (2,"3",neopixel.colors(NeoPixelColors.Red),true)
}



// variable ########################################
interface neop {
    pin: number;
    hwMatrix: Array<number>;
}

// hardwareeinstellungen ########################### 3 Matriken
let arr_tech_matrix = [[5, 5],[5, 7], [8, 8], [16, 16]];
let arr_tech_pin = [DigitalPin.P0, DigitalPin.P1, DigitalPin.P2, DigitalPin.P3, DigitalPin.P4, DigitalPin.P5, DigitalPin.P6, DigitalPin.P7, DigitalPin.P8];
// hardwareeinstellungen end ###########################

let zeichen_matrix: Array<number> = []
let neo_strip_anzahl: number = 1;
let shift: number = 0
let strip_helligkeit: number = 80;
let pause_bst: number = 2000; //auch scrollspeed
let hwx:number=8
let hwy:number=8
const zch_bit_breite:number=5


let neop_ges: Array<neopixel.Strip> = []
let arr_neop_settings: Array<neop> = []
let strip_ranges:Array<neopixel.Strip[]> = []
// let strip_ranges:Array<neopixel.Strip[]> = []






let arr_zeichen: number[][];
let bst_reihe: string = "";

// ende variable

//beginn initialisierung ############################
init_alphabet();
default_strip_data();
set_system(2);

let yy:neopixel.Strip[]
yy=strip_ranges[0]
yy[0].setPixelColor(0, NeoPixelColors.Blue);
yy[0].show()


yy=strip_ranges[1]
yy[0].setPixelColor(0, NeoPixelColors.Green);
yy[0].show()

yy=strip_ranges[1]
yy[0].setPixelColor(1, NeoPixelColors.Green);
yy[0].show()


//console.log("?? "+yy[0].start+" bis "+yy[0].length())

yy=strip_ranges[0]
yy[0].setPixelColor(1, NeoPixelColors.Red);
yy[0].show()




basic.showNumber(strip_ranges.length)

// showtext (0,"ABCDEEF",neopixel.colors(NeoPixelColors.Red),true)
// showtext (1,"abcdefg",neopixel.colors(NeoPixelColors.Blue),true)



// ende Initialisierung
