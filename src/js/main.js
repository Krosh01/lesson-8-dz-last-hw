let url = 'http://localhost:3000/products?'

let basket = [

]


let overlay = document.querySelector('.overlay')
let addBtn = document.querySelector('.add-btn')
let formClose = document.querySelector('.form__close')
let productsRow = document.querySelector('.products__row')
let form = document.querySelector('.form')
let seeAll = document.querySelector('.products__see')
let formChange = document.querySelector('.form-change')
let productsItem = document.querySelectorAll('.products__item')
let basketCount = document.querySelector('.header__list-cart')
let openBasket = document.querySelector('.header__item_cart')
let basketModal = document.querySelector('.basket')
let basketRow = document.querySelector('.basket__row')
let totalBasket = document.querySelector('.basket__end-value.total')
let saleBasket = document.querySelector('.basket__end-value.sale')
let headerTotal = document.querySelector('.header__list-price')


openBasket.addEventListener('click', () => {
    overlay.style.display = 'block'
    basketModal.style.display = 'block'
    basketRow.innerHTML = ''


    basket.forEach((item) => {
        basketRow.innerHTML += `
                            <div class="basket__card">
                            <div class="basket__card-left">
                            <img class="basket__card-img" src="${item.image}" alt="">
                           <div class="basket__card-center">
                            <h2 class="basket__card-title">${item.title}</h2>
                            <p class="basket__card-price">${item.price} $</p>
                            <div>
                                <button class="basket__card-plus">+</button><span>${item.count}</span><button class="basket__card-minus">-</button>
                            </div>
                        </div>
                     </div>
// это то что я добавил <button class='basket__card__delete-btn'><span>Delete</span></button>    
                        <button class="basket__card-btn">X</button>
             </div>
        `
    })
    // это то что я добавил
    let deleteCardBtn = document.querySelector('.basket__card__delete-btn')
    let basket__cardsss = document.querySelector('.basket__card')
    deleteCardBtn.addEventListener('click',   (e) => {
        e.preventDefault()
        basket__cardsss.remove()

        console.log('hui')

    })
    // это то что я добавил


    totalBasket.textContent = `${basket.reduce((acc, rec) => {
        return acc + rec.price * rec.count
    }, 0)} $`


    saleBasket.textContent = `${basket.reduce((acc, rec) => {
        return acc + rec.price * rec.count
    }, 0) / 100 * 5} $`
})




addBtn.addEventListener('click', function () {
    overlay.style.display = 'block'
    form.style.display = 'flex'
    formChange.style.display = 'none'
})

formClose.addEventListener('click', function () {
    overlay.style.display = 'none'
    form.style.display = 'none'
    formChange.style.display = 'none'
    basketModal.style.display = 'none'


})

overlay.addEventListener('click', function (e) {
    if (e.target.className.includes('overlay')) {
        overlay.style.display = 'none'
        form.style.display = 'none'
        formChange.style.display = 'none'
        basketModal.style.display = 'none'

    }
})

let all = ''

let status = 'All'


const refreshForm = (e) => {
    e.target[0].value = ''
    e.target[1].value = ''
    e.target[2].value = ''
    e.target[3].value = ''
    e.target[4].value = ''
    overlay.style.display = 'none'
    getProducts()
}


//products__row
function getProducts  () {
    productsRow.innerHTML = ''
    fetch(url + `${all.length ? '' : '_limit=4&'}${status === 'All' ? '' : 'category=' + status}`)
    .then((res) => res.json())
    .then((res) =>{
        res.forEach((item) => {
            productsRow.innerHTML += `
            <div class="products__card">
            <img src="${item.image}" alt="" class="products__card-img">
            <h3 class="products__card-title">
                ${item.title}
            </h3>
            <p class="products__card-price">
                $${item.price}
            </p>
            <div class="products__card-btns">
                <button  data-id = "${item.id}" class="products__card-btn products__card-basket">
                    Buy
                </button>
                <button data-id = "${item.id}"  class="products__card-btn products__card-change">
                    Change
                </button>
                <button data-id = "${item.id}" type = 'button' class="products__card-btn products__card-delete">
                    Delete
                </button>
            </div>

        </div>
            `
        })
        

        //функция delete
        let deleteBtns = document.querySelectorAll('.products__card-delete')
        Array.from(deleteBtns).forEach((btn) => {
            btn.addEventListener('click', () => {
                fetch(url + `/${btn.dataset.id}`, {
                    method: 'DELETE'
                }).then(() => {
                    getProducts()
                }).catch(() => alert('Ошибка при удалении'))
            })
        })


    let changeBtn = document.querySelectorAll('.products__card-change')
        Array.from(changeBtn).forEach((change) => {
            change.addEventListener('click', function() {
                overlay.style.display = 'block'
                formChange.style.display = 'flex'
                fetch(`http://localhost:3000/products/${change.dataset.id}`)
                .then((res) => res.json())
                .then((res) => {
                    formChange[0].value = res.title
                    formChange[1].value = res.price
                    formChange[2].value = res.memory
                    formChange[3].value = res.image
                    formChange[4].value = res.category
                })
                formChange.addEventListener('submit', (e) => {
                    let product = {
                        title: e.target[0].value,
                        price: e.target[1].value,
                        memory: e.target[2].value,
                        image: e.target[3].value,
                        category: e.target[4].value
                    }
                    fetch(`http://localhost:3000/products/${change.dataset.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(product)
                    }).then((res) => {
                        refreshForm()
                    }).catch(() => alert('Ошибка при добавлении'))
                })
               
            })

        })

        let basketBtn = document.querySelectorAll('.products__card-basket')
        Array.from(basketBtn).forEach((btn) => {
            btn.addEventListener('click', () => {
                fetch(`http://localhost:3000/products/${btn.dataset.id}`)
                .then((res) => res.json())
                .then((res) => {
                    // basket = [...basket, res]
                    // console.log(basket);

                    let have = basket.findIndex(el => el.id === res.id)
                    // console.log(have);

                    if(have >= 0){
                        basket[have] = {...basket[have], count: basket[have].count+1}
                    }else{
                        basket = [...basket, {
                        ...res,
                        count: 1
                    }]
                    }
                    
                    basketCount.textContent = basket.length

                    headerTotal.textContent = `${basket.reduce((acc, rec) => {
                        return acc + rec.price * rec.count
                    }, 0)} $`
                    
                }).catch(() => alert('Ошибка при изменения товара'))
            })
        })

    } ).catch((err) => alert(err))

}
getProducts()


//form
form.addEventListener('submit', (e) => {
    e.preventDefault()

//получение из база данных
    let product = {
        title: e.target[0].value,
        price: e.target[1].value,
        memory: e.target[2].value,
        image: e.target[3].value,
        category: e.target[4].value
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(product)
    }).then(() => {
        e.target[0].value = ''
        e.target[1].value = ''
        e.target[2].value = ''
        e.target[3].value = ''
        e.target[4].value = ''
        overlay.style.display = 'none'
        getProducts()
    })
    .catch(() => alert('Ошибка при добавлении'))
})

//seeAll
seeAll.addEventListener('click', () => {
    // console.log(seeAll.children);
    // seeAll.children[0].textContent = 'Hide All'
    if(seeAll.children[0].textContent === 'See All'){
        // getProducts('all')
        all = 'all'
        getProducts()

        seeAll.children[0].textContent ='Hide All'
    }else{
        seeAll.children[0].textContent = 'See All'
        all = ''
        getProducts()
    }
})


Array.from(productsItem).forEach((item) => {
    item.addEventListener('click', () => {
        Array.from(productsItem).forEach((el) => {
            if(el.textContent === item.textContent){
                el.classList.add('products__item_active')
            }else {
                el.classList.remove('products__item_active')
            }
        })
        status = item.textContent
        getProducts()
    })
})


