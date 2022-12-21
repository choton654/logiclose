import React, { useEffect, useState, useMemo } from 'react';
import { getData } from '../utils/localStorage';
import { useRouter } from "next/router"
import Loader from './Loader';

const IsAuthHOC = (WrapperComponent, exectRoute) => {
    return (props) => {

        const router = useRouter()
        const [isLoading, setIsloading] = useState(false)

        const isLoggedin = useMemo(() =>
            getData('token'), [])

        useEffect(() => {
            if (isLoggedin && exectRoute === undefined) {
                router.push('/executiveSummary/investmentSummary')
            } else if (isLoggedin) {
                router.push(exectRoute)
            } else if (!isLoggedin && (exectRoute === '/signup' ||
                exectRoute === '/forgotPass' || exectRoute === '/resetPass' ||
                exectRoute === '/about')) {
                router.push(exectRoute)
            } else {
                router.push('/')
            }

            if (isLoggedin && exectRoute === undefined) {
                setTimeout(() => {
                    setIsloading(true)
                }, 500)
            } else {
                setIsloading(true)
            }
        }, [isLoggedin])

        if (!isLoading) { return <Loader /> }

        return <WrapperComponent {...props} />
    }
}


export default IsAuthHOC;
