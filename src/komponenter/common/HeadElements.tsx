import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import MetaTags from 'react-meta-tags';

// Favicons
const fileFavicon = require('ikoner/favicon/favicon.ico');
const fileAppleTouchIcon = require('ikoner/favicon/apple-touch-icon.png');
const fileFavicon16x16 = require('ikoner/favicon/favicon-16x16.png');
const fileFavicon32x32 = require('ikoner/favicon/favicon-32x32.png');

export const HeadElements = () => {
    const { APP_URL } = useSelector((state: AppState) => state.environment);
    return (
        <MetaTags>
            <link rel="icon" type="image/x-icon" href={`${APP_URL}${fileFavicon}`} />
            <link rel="icon" type="image/png" sizes="16x16" href={`${APP_URL}${fileFavicon16x16}`} />
            <link rel="icon" type="image/png" sizes="32x32" href={`${APP_URL}${fileFavicon32x32}`} />
            <link rel="apple-touch-icon" sizes="180x180" href={`${APP_URL}${fileAppleTouchIcon}`} />
        </MetaTags>
    );
};

export default HeadElements;
