import React, { useState } from 'react';
import { useBoolean } from 'ahooks';
import { ReactSortable } from 'react-sortablejs';
import { remote } from 'electron';

import { ReactComponent as AddIcon } from '@/assets/icons/add.svg';
import { ReactComponent as MenuIcon } from '@/assets/icons/menu.svg';
import { ReactComponent as RemoveIcon } from '@/assets/icons/remove.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/edit.svg';
import CustomDrawer from '@/components/CustomDrawer';
import AddFundContent from '@/components/Home/FundList/AddFundContent';
import EditFundContent, {
  EditFundType,
} from '@/components/Home/FundList/EditFundContent';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import {
  getFundConfig,
  loadFunds,
  deleteFund,
  setFundConfig,
} from '@/actions/fund';
import { useActions, useScrollToTop } from '@/utils/hooks';
import styles from './index.scss';

export interface ManageFundContentProps {
  onEnter: () => void;
  onClose: () => void;
}
const defaultEdifFund = {
  name: '',
  cyfe: 0,
  code: '',
};
const { dialog } = remote;
const ManageFundContent: React.FC<ManageFundContentProps> = (props) => {
  const { fundConfig } = getFundConfig();
  const [sortFundConfig, setSortFundConfig] = useState(
    fundConfig.map((_) => ({ ..._, id: _.code }))
  );
  const [editFund, setEditFund] = useState<EditFundType>(defaultEdifFund);
  const runLoadFunds = useActions(loadFunds);
  const freshFunds = useScrollToTop({ after: runLoadFunds });
  const [
    showAddFundDrawer,
    {
      setTrue: openAddFundDrawer,
      setFalse: closeAddFundDrawer,
      toggle: ToggleAddFundDrawer,
    },
  ] = useBoolean(false);

  const [
    showEditDrawer,
    {
      setTrue: openEditDrawer,
      setFalse: closeEditDrawer,
      toggle: toggleEditDrawer,
    },
  ] = useBoolean(false);

  const updateSortFundConfig = () => {
    const { fundConfig } = getFundConfig();
    setSortFundConfig(fundConfig.map((_) => ({ ..._, id: _.code })));
  };

  const onSortFundConfig = (sortList: EditFundType[]) => {
    const fundConfig = sortList.map((item) => ({
      name: item.name,
      cyfe: item.cyfe,
      code: item.code,
    }));
    setFundConfig(fundConfig);
    updateSortFundConfig();
  };

  const onRemoveFund = async (fund: Fund.SettingItem) => {
    const { response } = await dialog.showMessageBox({
      title: '删除基金',
      type: 'info',
      message: `确认删除 ${fund.name || ''} ${fund.code}`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      deleteFund(fund.code);
      updateSortFundConfig();
    }
  };

  return (
    <CustomDrawerContent
      title="管理基金"
      enterText="确定"
      onEnter={() => {
        freshFunds();
        props.onClose();
      }}
      onClose={props.onClose}
    >
      <div className={styles.content}>
        <ReactSortable
          animation={200}
          delay={2}
          list={sortFundConfig}
          setList={onSortFundConfig}
          dragClass={styles.dragItem}
          swap
        >
          {sortFundConfig.map((fund) => {
            return (
              <div key={fund.code} className={styles.row}>
                <RemoveIcon
                  className={styles.remove}
                  onClick={(e) => {
                    onRemoveFund(fund);
                    e.stopPropagation();
                  }}
                />
                <div className={styles.inner}>
                  <div className={styles.name}>
                    {fund.name}
                    <span className={styles.code}>（{fund.code}）</span>
                  </div>
                  <div>
                    <span className={styles.cyfe}>
                      持有份额：{fund.cyfe.toFixed(2)}
                      <EditIcon
                        className={styles.editor}
                        onClick={() => {
                          setEditFund({
                            name: fund.name,
                            cyfe: fund.cyfe,
                            code: fund.code,
                          });
                          openEditDrawer();
                        }}
                      />
                    </span>
                  </div>
                </div>
                <MenuIcon className={styles.menu} />
              </div>
            );
          })}
        </ReactSortable>
      </div>
      <div
        className={styles.add}
        onClick={(e) => {
          openAddFundDrawer();
          e.stopPropagation();
        }}
      >
        <AddIcon />
      </div>
      <CustomDrawer show={showAddFundDrawer}>
        <AddFundContent
          onClose={closeAddFundDrawer}
          onEnter={() => {
            updateSortFundConfig();
            closeAddFundDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showEditDrawer}>
        <EditFundContent
          onClose={closeEditDrawer}
          onEnter={() => {
            updateSortFundConfig();
            closeEditDrawer();
          }}
          fund={{
            cyfe: editFund.cyfe,
            code: editFund.code,
            name: editFund.name,
          }}
        />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default ManageFundContent;