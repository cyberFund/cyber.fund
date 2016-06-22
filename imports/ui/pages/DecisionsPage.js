import React from 'react'
import { Grid, Cell } from 'react-mdl'

const DecisionsPage = params => {
        const signedBy =   <p>Signed by{' '}
                              <a href="https://keybase.io/21xhipster" target="_blank">Dima Starodubcev</a>,{' '}
                              <a href="https://keybase.io/cybermonetarist" target="_blank">Vitaly Lvov</a>,{' '}
                              <a href="https://keybase.io/creato1r" target="_blank">Kostya Lomashuk</a> and{' '}
                              <a href="https://keybase.io/mgureva" target="_blank">Marina Guryeva</a>
                            </p>
        const proofOfExistence =  <p>
                                      <a href="https://proofofexistence.com/sign/34668d06bf9cfd0d5177d352f6d6c615676337d6d39c66246ae365462f6cf0da" target="_blank">Proof of existence</a> at Bitcoin block{' '}
                                      <a href="https://www.blocktrail.com/BTC/tx/4716d8fddccb6c1a2c6fa21266ec3646eca992b519736291bd86bb416342340d" target="_blank">382471</a>,
                                      November 7th 2015, 13:15 GMT
                                  </p>

        return  <section id="DecisionsPage">
                    <Grid>
                          <Cell col={12}>
                            <h3 className="text-center">Decisions</h3>
                            <h5>#0. Genesis Agreement</h5>
                            <p><a href="/cyberFund_Genesis_Agreement.pdf" target="_blank">Full document</a></p>
                            {signedBy}
                            {proofOfExistence}
                            <h5>#1. Placement</h5>
                            <p><a href="/cyberFund_Placement.pdf" target="_blank">Full document</a></p>
                            {signedBy}
                            {proofOfExistence}
                          </Cell>
                    </Grid>
                </section>
}

export default DecisionsPage
