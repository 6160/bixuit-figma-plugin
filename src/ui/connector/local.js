const getPages = () => {
    return ['PAGE1', 'PAGE2', 'PAGE3'];
}

const getFrames = (pageId) => {

    const frames = {
        PAGE1: ['frame1.1', 'frame1.2', 'frame1.3'],
        PAGE2: ['frame2.1', 'frame2.2', 'frame2.3'],
        PAGE3: ['frame3.1', 'frame3.2', 'frame3.3'],
    }
    return frames[pageId];
}

const getText = (frameId) => {
    const texts = {
        'frame1.1': ['text1.1.1', 'text1.1.2', 'text1.1.3'],
        'frame1.2': ['text1.2.1', 'text1.2.2', 'text1.2.3'],
        'frame1.3': ['text1.3.1', 'text1.3.2', 'text1.3.3'],
        'frame2.1': ['text2.1.1', 'text2.1.2', 'text2.1.3'],
        'frame2.2': ['text2.2.1', 'text2.2.2', 'text2.2.3'],
        'frame2.3': ['text2.3.1', 'text2.3.2', 'text2.3.3'],
        'frame3.1': ['text3.1.1', 'text3.1.2', 'text3.1.3'],
        'frame3.2': ['text3.2.1', 'text3.2.2', 'text3.2.3'],
        'frame3.3': ['text3.3.1', 'text3.3.2', 'text3.3.3'],
    }

    return texts[frameId];
}



const changeText = (params) => {
    const pageId = params.pageId;
    const frameId = params.frameId;
    const textId = params.textId
    const newText = params.text;

    console.log(pageId, frameId, textId, newText)
}


const connector = {getPages, getFrames, getText, changeText}

export default connector;
