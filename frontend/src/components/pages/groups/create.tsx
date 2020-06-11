import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { withRouter } from 'react-router';
import styles from './create.scss';
import { Button, Card, Typography, TextField, MenuItem } from '@material-ui/core';

const MEET_TIMES = [
  {key: '11-13', name: '점심 (오전 11시~오후 1시)', hourIndex: 6},
  {key: '17-19', name: '이른 저녁 (오후 5~7시)', hourIndex: 12},
  {key: '19-21', name: '저녁 (오후 7~9시)', hourIndex: 14},
  {key: '21-24', name: '밤 (오후 9시~자정)', hourIndex: 17},
  {key: '0-2', name: '새벽 (자정~오전 2시)', hourIndex: 19},
  {key: '2-4', name: '완전 새벽 (오전 2~4시)', hourIndex: 21}
];

const getHour = () => {
  return moment().subtract('hours', 7).hour();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createPage(props: {history: any}) {
  const [title, setTitle] = React.useState('');
  const [talkLink, setTalkLink] = React.useState('');
  const [categories, setCategories] = React.useState<{key: string; name: string}[]>([]);
  const [category, setCategory] = React.useState<string | null>(null);
  const [meetTime, setMeetTime] = React.useState('');
  const [peopleNeeded, setPeopleNeeded] = React.useState(3);

  React.useEffect(() => {
    axios.get('/api/categories/list').then((resp) => {
      console.log(resp.data);
      setCategories(resp.data);
    });
  }, []);

  const talkLinkError = !(talkLink === '' || /^https:\/\/open.kakao.com\/o\/[a-zA-Z0-9]{6,8}$/.test(talkLink));
  const peopleNeededError = peopleNeeded < 2 || peopleNeeded > 8;

  const handleSubmit = () => {
    if ([title, talkLink, category, meetTime, peopleNeeded].filter(x => x === '').length > 0 || talkLinkError || peopleNeededError) {
      alert('모든 칸을 올바르게 입력해주세요.');
      return;
    }
    axios.post('/api/group/create', {
      category, peopleNeeded, talkLink, title, meetTime
    }, {validateStatus: () => true}).then((resp) => {
      if (resp.status === 200) {
        alert('모임이 생성되었습니다.');
        props.history.push(`/groups/${resp.data.id}`);
        return;
      }
      alert('오류가 발생했습니다.');
      console.log(resp);
    });
  };

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <Typography variant="h4" component="h4">
          모임 만들기
        </Typography>
        <div className={styles.input}>
          <TextField id="name" label="모임 이름" value={title} onChange={(v) => setTitle(v.target.value)} />
          <TextField id="talkLink" label="카카오톡 오픈채팅 링크" value={talkLink} onChange={(v) => setTalkLink(v.target.value)}
            error={talkLinkError} helperText={talkLinkError && '올바른 링크가 아닙니다.'}/>
          <TextField id="category" value={category} onChange={(v) => setCategory(v.target.value)} select label="먹을 종류">
            {categories.map((option) => (
              <MenuItem key={option.key} value={option.key}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField id="category" value={meetTime} onChange={(v) => setMeetTime(v.target.value)} select label="모이는 시간"
            helperText="오늘이나 내일 새벽까지만 정할 수 있어요">
            {MEET_TIMES.filter(x => x.hourIndex >= getHour()).map((option) => (
              <MenuItem key={option.key} value={option.key}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField id="peopleNeeded" value={peopleNeeded} onChange={(v) => setPeopleNeeded(parseInt(v.target.value))} type="number"
            error={peopleNeededError} helperText="본인 포함 2~8명으로 정해주세요" label="필요 인원"/>
        </div>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          만들기
        </Button>
      </Card>
    </div>
  );
}

export default withRouter(createPage);
