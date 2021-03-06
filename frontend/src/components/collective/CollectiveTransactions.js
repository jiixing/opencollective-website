import React from 'react';

import CollectiveActivityItem from './CollectiveActivityItem';
import TransactionEmptyState from '../TransactionEmptyState';

export default class CollectiveTransactions extends React.Component {
  render() {
    const {
      users,
      collective,
      transactions,
      i18n,
      itemsToShow = 5
    } = this.props;

    return (
      <div className='Collective-transactions col col-12 mb3'>
        {(transactions.length === 0) && 
          <TransactionEmptyState i18n={i18n} link={`/${collective.slug}/transactions`}/>}
        <div className='Collective-transactions-list'>
          {transactions
            .slice(0, itemsToShow)
            .map(transaction => 
              <CollectiveActivityItem
                key={`pgd_${transaction.uuid}`}
                transaction={transaction}
                user={users[transaction.UserId]}
                className='' i18n={i18n} />)}
        </div>
        <div className='center pt2'>
          {(transactions.length >= itemsToShow) && (
            <a className='-btn -btn-medium -btn-outline -border-green -ttu -fw-bold' href={`/${collective.slug}/transactions`}>
              {i18n.getString('seeAllTransactions')} >
            </a>
          )}
        </div>
      </div>
    );
  }
}
