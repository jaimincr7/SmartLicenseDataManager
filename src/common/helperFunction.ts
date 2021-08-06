export const getPageHeight=()=>{
    const header = document.querySelector('.header')?.clientHeight;
    const title = document.querySelector('.title-block')?.clientHeight;
    const tableHeader = document.querySelector('thead').offsetHeight;
    const totalHeight = document.body.clientHeight;
    const finalHeight = totalHeight - header - (2 * title) - tableHeader - 50;
    return finalHeight;
}
