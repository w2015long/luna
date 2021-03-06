import { useState, useEffect, useRef } from 'react';
import api from './api';
import { useDispatch } from 'react-redux';
import { ApiOptionsConfig, ApiSuccessMessage } from '../../model/apiHelper';
import normalActions from '../../model/normalActions';

export interface UseApiOptions {
  requestFirstTime?: boolean;
  message?: ApiSuccessMessage;
  clearDataWhenRequestError?: boolean;
  defaultLoading?: boolean;
}

interface ApiStatus<T> {
  loading: boolean;
  success: boolean;
  data: T;
}

/**
 * 注入请求参数
 */
let getCommonParams = () => {
  return {};
};

/**
 * 配置注入请求参数方法
 */
export function setGetCommonParams(p: () => any) {
  getCommonParams = p;
}

export default function useApi<T = any>(
  apiOptions: ApiOptionsConfig,
  options: UseApiOptions = { requestFirstTime: true },
) {
  const realOptions: UseApiOptions = {
    requestFirstTime: true,
    clearDataWhenRequestError: false,
    defaultLoading: false,
    ...options,
  };
  const prevParams = useRef(apiOptions.data);
  const [ status, setStatus ] = useState<ApiStatus<T>>({
    loading: realOptions.defaultLoading,
    success: false,
    data: {} as T,
  });
  let canSetData = true;
  let dispatch = null;
  try {
    dispatch = useDispatch();
  } catch (err) {
  }

  function sendError(err) {
    if (dispatch) {
      dispatch({
        type: 'api-useApi_error',
        payload: {
          error: err,
        },
      });
    }
  }

  function request(newParams = prevParams.current, newOptions = apiOptions.options) {
    setStatus(s => {
      return {
        ...s,
      loading: true,
      success: false,
      };
    });
    canSetData = true;
    prevParams.current = newParams;
    api.request({
      ...apiOptions,
      data: {
        ...newParams,
        ...getCommonParams(),
      },
      options: newOptions,
    }).then(resData => {
      if (canSetData) {
        setStatus({
          loading: false,
          success: true,
          data: resData,
        });
        if (dispatch) {
          dispatch(normalActions.apiSuccess({
            message: realOptions.message,
          }));
        }
      }
    }).catch(err => {
      console.log(err);
      setStatus(s => {
        return {
          data: realOptions.clearDataWhenRequestError ? {} as T : s.data,
          loading: false,
          success: false,
        };
      });
      sendError(err);
    });
  }

  useEffect(() => {
    if (realOptions.requestFirstTime) {
      request();
    }

    return (() => {
      canSetData = false;
    });
  }, [apiOptions.path]);

  return {
    data: status.data,
    request,
    loading: status.loading,
    success: status.success,
  };
}
