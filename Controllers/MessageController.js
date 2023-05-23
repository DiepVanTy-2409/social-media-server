import MessageModel from './../Models/MessageModel.js';
export const addMessage = async (req, res) => {
    try {
        const message = new MessageModel(req.body)
        const result = await message.save()
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
export const getMessages = async (req, res) => {
    const { chatId } = req.params
    try {
        const result = await MessageModel.find({ chatId: chatId })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}