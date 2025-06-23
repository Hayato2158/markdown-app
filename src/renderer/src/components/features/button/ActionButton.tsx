import React, { ComponentPropsWithoutRef } from 'react'

/** scss */
import style from '@renderer/styles/features/button/actionButton.module.scss'

export type ActionButtonProps = ComponentPropsWithoutRef<'button'>

export const ActionButton = ({ children, ...props }: ActionButtonProps): React.JSX.Element => {
  return (
    <button
      type="button"
      className={style.wrapper}
      {...props}
    >
      {children}
    </button>
  )
}
