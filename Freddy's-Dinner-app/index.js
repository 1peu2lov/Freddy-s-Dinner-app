import {menuArray} from '/data.js'

const menuContainer = document.getElementById('menu-container')
const orderContainer = document.getElementById('order-container')
const payForm = document.getElementById('pay-form')

let totalPrice = 0
let formDisplayed = false


function renderMenu(menuArray){
    let menu = ""
    
    menuArray.map(foodEl =>{
        const {id, emoji, name, ingredients, price} = foodEl
        menu += `<div class="food-element">
                    <div>
                        <p class="food-emoji">${emoji}</p>
                        <div class="desc-food-container">
                            <h2 class="food-name">${name}</h2>
                            <p class="ingredients">${ingredients}</p>
                            <p class="price">${price}$</p>
                        </div>
                    </div>
                    <button class="add-food-btn" data-add="${id}" id="${id}">+</button>
                </div>`
    })
    return menu 
}

document.getElementById("pay-form").addEventListener('submit', (e)=>{
    e.preventDefault()
    
    const payFormData = new FormData(payForm)
    const name = payFormData.get('name')
    document.getElementById('order-form').classList.add('hidden')
    
    orderContainer.innerHTML = `<p class="end-message-order">Thanks ${name}! Your order is on its way!</p>`
    
    menuArray.forEach(foodEl=> foodEl.quantity = 0)
    totalPrice = 0
    enableAllButtons()
    
})

document.addEventListener('click', e => {
    const targetId = e.target.id
    const orderForm = document.getElementById('order-form')

    if (targetId && targetId.startsWith("remove-btn-")) {
        handleRemoveClickBtn(targetId.replace("remove-btn-", ""))
    } else if (targetId === 'complete-order-btn') {
        displayForm(e)
    } else if (e.target.dataset.add) {
        handleAddClickBtn(targetId)
        console.log('add')
    } else if(formDisplayed && !orderForm.contains(e.target)){
        document.getElementById('order-form').classList.add('hidden')
        enableAllButtons()   
    }
})

function displayForm(e){
    document.getElementById('order-form').classList.remove('hidden')
    formDisplayed = true
    disableAllButtonsExceptForm()
}

function disableAllButtonsExceptForm() {
    const buttons = document.querySelectorAll('button')
    const orderForm = document.getElementById('order-form')

    buttons.forEach(button => {
        if (!orderForm.contains(button)) {
            button.disabled = true
        }
    })
}

function enableAllButtons() {
    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => {
        button.disabled = false
    })
}


function handleAddClickBtn(targetId){
    const targetFoodElObj = menuArray.filter(function(foodEl){
        return foodEl.id === targetId
    })[0]
    
    targetFoodElObj.quantity += 1 
    
    totalPrice = totalPrice + targetFoodElObj.price
    
    orderContainer.innerHTML = renderOrder(menuArray)
}

function handleRemoveClickBtn(targetId){
    const targetFoodElObj = menuArray.filter(function(foodEl){
        return foodEl.id === targetId
    })[0]
    
    if (targetFoodElObj.quantity > 0) {
        targetFoodElObj.quantity -= 1
        totalPrice = totalPrice - targetFoodElObj.price
    }
    
    orderContainer.innerHTML = renderOrder(menuArray)
}


function renderOrder(menuArray){
    let order =""
    
    menuArray.map(foodEl =>{
        const {id, name, price, quantity} = foodEl
        
        let hiddenClass = quantity <= 0? "hidden":""
        
        
        order += ` <div class="displayed-order ${hiddenClass}">
                        <div>
                            <h2>${name} 
                            <span class="quantity-show">x${quantity}</span>
                            </h2>
                            <button class="btn-order-remove" id="remove-btn-${id}">remove</button>
                        </div>
                        <p class="price">${price * quantity}$</p>
                    </div>`
    })
    
    
    
    order +=  `<div class="total-container ${totalPrice > 0?"": "hidden"}">
                <div>
                    <h2>Total price:</h2>
                    <p class="price">${totalPrice}$</p>
                </div>
                    <button class="complete-order-btn" id="complete-order-btn"> 
                        Complete Order 
                    </button>
                </div>`
    
    return order  
}

menuContainer.innerHTML = renderMenu(menuArray)