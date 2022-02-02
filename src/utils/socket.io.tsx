import React from 'react';
import commonService from '../services/common/common.service';
import { useAppSelector } from '../store/app.hooks';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import config from './config';
import { userSelector } from '../store/administration/administration.reducer';

let tryToConnect = 0;
let socket;

export enum SocketNotificationType {
  FilePath,
  Message,
  Error
}

export const SocketIO = React.memo(() => {
  const userDetails = useAppSelector(userSelector);

  const connectSocket = () => {
    if (userDetails?.activeAccount?.username && tryToConnect < 5) {
      tryToConnect++;
      try {
        commonService
          .getJwtTokenForSocket()
          .catch(() => null)
          .then((res) => {
            if (res) {
              socket = io(config.baseApi, {
                extraHeaders: {
                  Authorization: res.body.data,
                },
              });
              if (socket) {
                socket.on(userDetails.activeAccount.username, (message) => {
                  if (message) {
                    switch (message.type) {
                      case SocketNotificationType.FilePath:
                        toast(
                          () => (
                            <span style={{ color: '#014e97' }}>
                              <a
                                href={`${config.baseApi}\\${message.data}`}
                                target="_blank"
                                rel="noreferrer"
                                download
                              >
                                <strong style={{ color: '#014e97' }}>Click here</strong>{' '}
                                <span style={{ color: 'black' }}>
                                  to download the file ({message.data.replace(/^.*(\\|\/)/, '')}).
                                </span>
                              </a>
                            </span>
                          ),
                          { autoClose: false }
                        );
                        break;
                      case SocketNotificationType.Message:
                        toast.info(message.message);
                        break;
                      case SocketNotificationType.Error:
                        if(message?.data){
                          const info = JSON.parse(message.data);
                          if(info.status && info?.body?.errors && Array.isArray(info?.body?.errors)){
                            toast.info(`${info.status} - ${info.body.errors.join(' ')}`);
                          }
                        }
                        break;
                      default:
                        toast.info(message);
                        break;
                    }
                  }
                });

                socket.on('disconnect', () => {
                  // console.info('Socket is disconnected');
                  socket.off();
                  setTimeout(() => {
                    connectSocket();
                  }, 10000);
                });

                // socket.on('connect', () => {
                //   console.info('Socket is connect');
                // });
              }
            }
          });
      } catch (error) {
        socket.off();
        setTimeout(() => {
          connectSocket();
        }, 10000);
      }
    }
  };

  // Set socket io
  React.useEffect(() => {
    tryToConnect = 0;
    connectSocket();
    return () => {
      if (socket) {
        tryToConnect = 11;
        socket.off();
        socket.disconnect();
      }
    };
  }, [userDetails?.activeAccount?.username]);

  return <></>;
});
