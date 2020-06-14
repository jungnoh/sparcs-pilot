import React from 'react';
import styles from './404.scss';
import HingingImage from '@src/media/hinging.png';
import { Typography } from '@material-ui/core';


export default function NotFoundPage() {
  return (
    <div className={styles.root}>
      <Typography variant="h4">페이지를 찾을 수 없습니다</Typography>
      <img src={HingingImage} />
    </div>
  );
}
