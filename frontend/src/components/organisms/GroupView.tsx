import { Card, Typography, Button } from '@material-ui/core';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import moment from 'moment';
import React from 'react';
import styles from './GroupView.scss';
import { MEET_TIMES } from '@src/types/constants';

interface GroupViewProps {
  title: string;
  talkLink: string;
  category: string;
  meetDate: Date;
  meetTime: string;
  peopleCnt: number;
  peopleNeeded: number;
  ownerName: string;
  ownerEmail: string;
  isOwner: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  members: any[];
  allowLeave?: boolean;
}

export default function GroupView(props: GroupViewProps) {
  const meetFilter = MEET_TIMES.filter(x => x.key === props.meetTime);
  const meetTimeText = meetFilter.length > 0 ? meetFilter[0].name : '';

  const handleChatOpen = () => {
    window.open(props.talkLink, '_blank');
  };
  return (
    <Card className={styles.root}>
      <Typography variant="h5">{props.title}</Typography>
      <div className={styles.info}>
        <span>{props.peopleCnt} / {props.peopleNeeded}명 참여중</span>
        <span className={styles.nameRow}>
          <Typography>방장:&nbsp;</Typography>
          {props.isOwner ? (<Typography color="primary">나</Typography>) : (<Typography color="primary">{`${props.ownerName} (${props.ownerEmail})`}</Typography>)}
        </span>
        <span>먹을 종류: {props.category}</span>
        <span>
          약속 시간: {moment(props.meetDate).format('yyyy년 MM월 DD일')}, {meetTimeText}
        </span>
      </div>
      <Typography color="secondary">채팅방의 이름을 {props.isOwner ? '사이트 이름과 똑같이' : `${props.joinName}으로`} 설정해 주세요!</Typography>
      <div className={styles.actions}>
        <Button variant="contained" style={{backgroundColor: 'rgb(255, 224, 52)'}}
          startIcon={<ChatBubbleIcon />} onClick={handleChatOpen} className={styles.talkBtn}>
          오픈채팅 참여하기
        </Button>
        {props.allowLeave && (
          <Button color="primary">모임 나가기</Button>
        )}
      </div>
    </Card>
  );
}
