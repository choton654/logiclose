import { store } from '../app/store'
import { Provider } from 'react-redux'
import { useEffect, useState } from 'react'
import { StyledEngineProvider } from "@mui/material"
import "../styles/globals.css"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import Loader from '../components/Loader'
import { storeData } from '../utils/localStorage'

const MyApp = ({ Component, pageProps }) => {

  const [isMounted, setIsMounted] = useState(false);
  const [dimension, setDimension] = useState(null)

  useEffect(() => {
    const { innerHeight, innerWidth } = window
    setDimension({ innerHeight, innerWidth })
    setIsMounted(true);
  }, [])

  if (!isMounted) {
    return <Loader />;
  }

  const cacheSteps = localStorage.getItem('stepCompleted')

  if (!cacheSteps) {
    const stepCompleted = [
      {
        label: 'Investment Summary',
        completed: false
      },
      {
        label: 'Investment Oppurtunity',
        completed: false
      },
      {
        label: 'Demographic Summary',
        completed: false
      },
      {
        label: 'Property Summary',
        completed: false
      },
      {
        label: 'Community Features',
        completed: false
      },
      {
        label: 'Unit Features',
        completed: false
      },
      {
        label: 'Floor Plans',
        completed: false
      },
      {
        label: 'Comps',
        completed: false
      },
      {
        label: 'Loaction Summary',
        completed: false
      },
      {
        label: 'Employers',
        completed: false
      },
      {
        label: 'Sources/Uses',
        completed: false
      },
      {
        label: 'Closing Costs Breakdown',
        completed: false
      },
      {
        label: 'Loan Terms',
        completed: false
      },
      // {
      //   label: 'Projected Income & Annual Rent',
      //   completed: false
      // },
      {
        label: 'Proforma',
        completed: false
      },
      {
        label: 'Refinance Scenario',
        completed: false
      },
      {
        label: 'Sale Scenario',
        completed: false
      },
    ]
    storeData('stepCompleted', JSON.stringify(stepCompleted))
  }

  return (
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <Component {...pageProps} dimension={dimension} />
      </Provider>
    </StyledEngineProvider>
  )
}

export default MyApp
