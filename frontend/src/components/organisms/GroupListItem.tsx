import { Card, Typography, Button } from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import styles from './GroupListItem.scss';
import { MEET_TIMES } from '@src/types/constants';

interface GroupListItemProps {
  title: string;
  category: string;
  meetDate: Date;
  meetTime: string;
  peopleCnt: number;
  peopleNeeded: number;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  history: any;
}

export default function GroupListItem(props: GroupListItemProps) {
  const meetFilter = MEET_TIMES.filter(x => x.key === props.meetTime);
  const meetTimeText = meetFilter.length > 0 ? meetFilter[0].name : '';

  const handleJoin = () => {
    if (!confirm('모임을 가입하시겠어요?')) {
      return;
    }
    axios.post('/api/group/join', {group: props.id}, {validateStatus: () => true})
      .then((resp) => {
        if (resp.status === 401) {
          alert('먼저 로그인해 주세요.');
          props.history.push('/auth/login');
          return;
        }
        if (resp.status === 403) {
          alert('이미 이 모임에 가입되어 있습니다.');
          return;
        }
        if (resp.status !== 200) {
          alert('오류가 발생했습니다.');
          console.log(resp);
          return;
        }
        props.history.push(`/groups/${props.id}`);
      });
  };
  const handleTitleClick = () => {
    props.history.push(`/groups/${props.id}`);
  };
  return (
    <Card className={styles.root}>
      <Typography variant="h5" className={styles.title} onClick={handleTitleClick}>
        {props.title}
      </Typography>
      <div className={styles.info}>
        <span>{props.peopleCnt} / {props.peopleNeeded}명 참여중</span>
        <span>먹을 종류: {props.category}</span>
        <span>
          약속 시간: {moment(props.meetDate).format('yyyy년 MM월 DD일')}, {meetTimeText}
        </span>
      </div>
      <Button variant="contained" color="primary" onClick={handleJoin} className={styles.talkBtn}
        disabled={props.peopleCnt >= props.peopleNeeded}>
        참여하기
      </Button>
    </Card>
  );
}
