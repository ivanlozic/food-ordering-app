import { BackToTopButton } from '../../components/buttons/back-to-top-button/index'
import { Navbar } from '../../components/navigation/navbar'
import React, { useEffect, useState, useRef } from 'react'
import Modal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../redux-store/reducers/cartReducer'
import { MenuItem } from '../../components/ment-item'
import classes from './HomePage.module.css'
import { CloseButton } from '../../components/buttons/close-button'
import { DecreaseButton } from '../../components/buttons/decrease-button'
import { IncreaseButton } from '../../components/buttons/increase-button'
import Spinner from '../../components/spinner/Spinner'
import useFetch from '../../hooks/useFetch/useFetch'
import { axiosRoutes } from '../../constants/constants'
import promoImg from '../../assets/images/20.jpg'
import Footer from '../../components/footer/Footer'
import UserReviewSection from '../../components/user-review-section/UserReviewSection'
import heroImage from '../../assets/images/heroImage.jpg'
import OpeningTime from '../../components/opening-time/OpeningTime'
import MenuNav from '../../components/menu-nav/MenuNav'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  }
}

const HomePage = () => {
  const dispatch = useDispatch()
  const [menu] = useFetch(axiosRoutes.menu)
  const [loading, setLoading] = useState(!menu)
  const user = useSelector((state) => state.user)
  const [modalData, setModalData] = useState({
    isOpen: false,
    selectedItem: null,
    totalPriceValue: 0,
    currentQuantity: 1
  })
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const menuRef = useRef(null)

  const { isOpen, selectedItem, totalPriceValue, currentQuantity } = modalData

  const menuDataByType = {
    pasta: getMenuDataByType('pasta'),
    popcorn: getMenuDataByType('popcorn'),
    'fries-meat': getMenuDataByType('fries-meat'),
    burgers: getMenuDataByType('burgers'),
    dogs: getMenuDataByType('dogs'),
    other: getMenuDataByType('other'),
    drinks: getMenuDataByType('drinks')
  }

  function getMenuDataByType(type) {
    return menu ? menu.filter((item) => item.type === type) : []
  }

  const generateMenuComponents = () => {
    return Object.keys(menuDataByType).map((type, index) => {
      const itemList = menuDataByType[type]
      const filteredItems = itemList.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )

      return (
        filteredItems.length > 0 && (
          <div id={type} key={`${type}-${index}`}>
            <MenuItem
              items={filteredItems}
              itemType={type}
              modal={openModal}
              key={`${type}-${index}`}
            />
          </div>
        )
      )
    })
  }

  function handleScrollToMenu() {
    if (menuRef.current) {
      window.scrollTo({
        top: menuRef.current.offsetTop,
        behavior: 'smooth'
      })
    }
  }

  function openModal(pasta) {
    setModalData({
      isOpen: true,
      selectedItem: pasta,
      totalPriceValue: pasta.price,
      currentQuantity: 1
    })
  }

  function increaseQuantity() {
    const newQuantity = currentQuantity + 1
    setModalData({
      ...modalData,
      currentQuantity: newQuantity,
      totalPriceValue: newQuantity * selectedItem.price
    })
  }

  function decreaseQuantity() {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1
      setModalData({
        ...modalData,
        currentQuantity: newQuantity,
        totalPriceValue: newQuantity * selectedItem.price
      })
    }
  }

  function addItemToCart() {
    const newPasta = {
      id: selectedItem.id,
      name: selectedItem.title,
      quantity: currentQuantity,
      totalAmount: totalPriceValue,
      price: selectedItem.price,
      type: selectedItem.type
    }
    dispatch(addToCart(newPasta))
    setModalData({
      isOpen: false,
      selectedItem: null,
      totalPriceValue: 0,
      currentQuantity: 1
    })
  }

  const showWelcomeModalAfterDelay = () => {
    setTimeout(() => {
      setShowWelcomeModal(true)
    }, 2000)
  }

  useEffect(() => {
    setLoading(!menu)
  }, [menu])

  useEffect(() => {
    if (!user.isLoggedIn) {
      showWelcomeModalAfterDelay()
    }
  }, [user])

  const handleSearchInputChange = (query) => {
    setSearchQuery(query)
  }

  return (
    <div>
      <Navbar onSearch={handleSearchInputChange} />
      <div className={classes.main}>
        <div className={classes.heroSection}>
          <div className={classes.heroContent}>
            <h1>Welcome to Our Restaurant</h1>
            <p>Discover a world of delicious flavors and culinary delights.</p>
            <button className={classes.heroButton} onClick={handleScrollToMenu}>
              Explore Menu
            </button>
          </div>
          <img
            className={classes.heroImage}
            src={heroImage}
            alt='Delicious Food'
          />
        </div>
        <MenuNav scrollRef={menuRef} />
        <input
          type='text'
          placeholder='Search for meals and drinks by name'
          value={searchQuery}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          className={classes.searchInput}
        />
        {loading ? <Spinner /> : generateMenuComponents()}

        <Modal
          isOpen={isOpen}
          onRequestClose={() => {
            setModalData({
              ...modalData,
              isOpen: false,
              selectedItem: null,
              currentQuantity: 1
            })
          }}
          contentLabel='Example Modal'
          ariaHideApp={false}
          className={classes.Modal}
          style={customStyles}
        >
          {selectedItem && (
            <div>
              <div className={classes.container}>
                <img
                  className={classes.imgModal}
                  src={`menu/${selectedItem.type}/${selectedItem.id}.jpeg`}
                  alt={selectedItem.title}
                />

                <CloseButton
                  onClick={() => {
                    setModalData({
                      ...modalData,
                      isOpen: false,
                      selectedItem: null,
                      currentQuantity: 1
                    })
                  }}
                />
              </div>

              <div className={classes.info}>
                <h2>{selectedItem.title}</h2>
                <p>{selectedItem.description}</p>
                <p>${selectedItem.price.toFixed(2)}</p>
              </div>

              <div className={classes.orderBox}>
                <div className={classes.quantity}>
                  <DecreaseButton
                    onClick={decreaseQuantity}
                    disabled={currentQuantity === 1}
                  />
                  <p>{currentQuantity}</p>
                  <IncreaseButton onClick={increaseQuantity} />
                </div>

                <div onClick={addItemToCart} className={classes.totalAmount}>
                  <p>Add to order</p>
                  <p>
                    $ &nbsp;
                    {currentQuantity === 1 && selectedItem.price.toFixed(2)}
                    {currentQuantity !== 1 && totalPriceValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {showWelcomeModal && (
          <Modal
            isOpen={true}
            contentLabel='Welcome Modal'
            ariaHideApp={false}
            className={classes.welcomeModal}
            style={customStyles}
          >
            <img className={classes.imgModal} src={promoImg} alt={'20'} />
            <h2>
              Welcome to our website! Free register and make 20% off on your
              first order!
            </h2>

            <button onClick={() => setShowWelcomeModal(false)}>Close</button>
          </Modal>
        )}
      </div>
      <OpeningTime />
      <UserReviewSection />
      <Footer />
      <BackToTopButton />
    </div>
  )
}

export default HomePage
