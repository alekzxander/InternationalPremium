function del(e) {
    if (confirm('Êtes vous sur de vouloir supprimer ce voyage ?')) {
        console.log('isCheck')
        console.log('confirmer')
    } else {
        console.log('isCheck')
        e.preventDefault()
        e.stopPropagation()
    }
}
let isCheck = document.querySelectorAll('.checked');
console.log(isCheck);
for (let i = 0; i < isCheck.length; i++) {
    isCheck[i].addEventListener('click', del);
}