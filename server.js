const tgBot=require('node-telegram-bot-api')
const { text } = require('stream/consumers')
const { mainMenyu, cours } = require('./keybords/keybord')
const api='5588720741:AAErYVazglVoLAo47rkePP5ykdCX9C4vgH8'
const {read,write}=require('./utils/FS')

 const bot= new tgBot(api,{
    polling:true
 })

 bot.on('message', msg => {
    const userId = msg.chat.id
    if(msg.text=='/start'){
            bot.sendMessage(userId, (`Assalomu alaykum ${msg.from.first_name}`), {
            reply_markup: JSON.stringify({
                keyboard: mainMenyu,
                resize_keyboard: true
            })
        })
    }
    
})
bot.on('message', msg => {
    const userId = msg.chat.id
    if(msg.text=='Biz haqimizda'){
            bot.sendMessage(userId, (`O’quv markaz 2008-yildan buyon o’z faoliyatini yuritib kelmoqda. Shu vaqtga qadar 6000 ga yaqin abituriyentlarni talabaga aytlantirgan, ko’plab mahalliy institutlar, universitetlar va chet el oliygohlariga talabalar yetkazgan. Azizbek Ibragimov birinchi bo’lib 0dan boshlagan hammasini shu darajaga olib chiqqan ustozimiz.`), {
            reply_markup: JSON.stringify({
                keyboard: mainMenyu,
                resize_keyboard: true
            })
        })
    }
    
})
bot.on('message', msg => {
    const userId = msg.chat.id
    if(msg.text=='Bizning manzil'){
        bot.sendLocation(userId, 40.86941561643252, 69.6043881693151, {
            reply_markup: JSON.stringify({
                keyboard: mainMenyu,
                resize_keyboard: true
            })
        })
    }
    
})
bot.on('message', msg => {
    const userId = msg.chat.id

    if(msg.text=='Bizning kurslar'){
            bot.sendMessage(userId, msg.text, {
            reply_markup: JSON.stringify({
                keyboard: cours,
                resize_keyboard: true
            })
        })
    }
    
})

bot.on('message',msg=>{
    const userId=msg.chat.id
    if(msg.text=='Bosh menyu') {
        bot.sendMessage(userId, msg.text, {
            reply_markup: JSON.stringify({
                keyboard: mainMenyu,
                resize_keyboard: true
            })
        })
    }
})

bot.on('message',async msg => {
    const userId = msg.chat.id

    const foundCours =await read('./model/cours.json')?.find(e => e.name == msg.text)

    if(foundCours) {
        bot.sendPhoto(userId, ('./img/2.jpg'), {
            caption: `<strong>${foundCours.name}</strong>\nFan o'qituvchilar:${foundCours.teachers.map(e=>`\n<strong>${e}</strong>`)}`,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Kursga yozilish',
                            callback_data: 'kurs'
                        },
                        {
                            text: 'Orqaga',
                            callback_data: 'orqaga'
                        }
                    ]
                ]
            }
        })
    }
    
})
bot.on('callback_query',async (msg) => {
        if(msg.data == 'orqaga') {
            
            bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
    
        }
        const cours = msg.message.caption.split('\n')[0]
        if(msg.data == 'kurs') {
            const contactData = await  bot.sendMessage(msg.message.chat.id, "Telefon raqamingizni jo`nating", {
                reply_markup: JSON.stringify({
                    keyboard: [
                        [
                            {
                                text: "Yuborish",
                                request_contact: true
                            }
                        ],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                })
            })
            

            bot.onReplyToMessage(contactData.chat.id, contactData.message_id, async msg => {
                bot.sendMessage(1924264088,(`Siz ro'yxatdan o'tmoqchi bo'lgan kurs ${cours} \nSizning telefon raqamingiz ${msg.contact.phone_number} \nMalumotlarni tasdiqlaysizmi?`),{
                    reply_markup:JSON.stringify({
                        keyboard:[
                            [
                                {text:"Ha"},
                                {text:"Yo'q"}
                            ]
                        ],
                        resize_keyboard:true
                    })
                })
                bot.on('message',mass=>{
                        const userId=mass.chat.id
                        if(mass.text=="Yo'q") {
                            bot.sendMessage(userId, "Qayta urinib ko'ring ro'yxatdan o'tishga", {
                                reply_markup: JSON.stringify({
                                    keyboard: mainMenyu,
                                    resize_keyboard: true
                                })
                            })
                        }
                        if(mass.text=="Ha") {
                            bot.sendMessage(-738095431,(`${msg.chat.first_name} ismli shaxs  \n${cours} fanga ro'yxatdan o'tdi  \nTel raqami:${msg.contact.phone_number}`))
                            bot.sendMessage(userId, "Siz ro'yxatdan o'tdingiz, yaqin orada siz bilan aloqaga chiqamiz, qo'shimcha savollaringiz bo'lsa tel:+9989930008555", {
                                reply_markup: JSON.stringify({
                                    keyboard: mainMenyu,
                                    resize_keyboard: true
                                })
                            })
                        }
                    })
            })
            bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
        }
    })