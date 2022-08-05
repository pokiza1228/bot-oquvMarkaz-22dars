const { bizning_kurslar, biz_haqimizda, manzil } = require("./keyborts.text");
const {read,write}=require('../utils/FS')
const mainMenyu=[
    [
        bizning_kurslar,
        biz_haqimizda
    ],
    [
        manzil
    ]
]
const cours=[]
const allCours=read('./model/cours.json')
for(let i=0; i<allCours.length;i=i+2) {
    const arr=[]
    
    arr.push({ text:allCours[i]?.name }, allCours[i + 1] ? { text: allCours[i + 1 ].name} : null)
    cours.push(arr.filter(e => e))
}
cours.push([{text:"Bosh menyu"}])
module.exports={
    mainMenyu,
    cours
}