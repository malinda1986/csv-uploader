import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table} from 'antd'
import { Trans, withI18n } from '@lingui/react'
import styles from './List.less'


@withI18n()
class List extends PureComponent {

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

    const columns = [
     
      {
        title: <Trans>Name</Trans>,
        dataIndex: 'name',
        key: 'name',
      },
      
      {
        title: <Trans>Age</Trans>,
        dataIndex: 'age',
        key: 'age',
      },
      
      {
        title: <Trans>Team</Trans>,
        dataIndex: 'team',
        key: 'team',
      },
      
      {
        title: <Trans>Address</Trans>,
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: <Trans>CreateTime</Trans>,
        dataIndex: 'created',
        key: 'created',
      },
    ]

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
