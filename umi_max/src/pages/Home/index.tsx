import Guide from '@/components/Guide';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import { connect } from '@umijs/max';
import {useEffect }from 'react';

const HomePage: React.FC = ({dispatch,authModel}:any) => {
  
  useEffect(()=>{
    console.log(authModel)

  })
  
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={""} />
      </div>
    </PageContainer>
  );
};

export default connect((state: any)=>state)(HomePage);