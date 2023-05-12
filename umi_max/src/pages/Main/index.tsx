import { connect } from '@umijs/max';
import { history,Outlet } from '@umijs/max';
import {useEffect, useState} from 'react';

const MainPage: React.FC = ({dispatch,authModel}:any) => {

  const [auth,setAuth]=useState(false);

  useEffect(()=>{
    setAuth(authModel.auth)
    console.log(authModel.auth)
    console.log(history.location)
  })

  return (
    <>
      <Outlet/>
      {`权限${auth}`}
    </>
    
  );
};

export default connect((state: any)=>state)(MainPage);