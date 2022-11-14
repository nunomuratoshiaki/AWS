#!/bin/sh

# checks that the same folder has the following file
#   awr_chk.sql
#   auto_chk.sql
#   sec_chk.sql
#   info.sql
#   rman.rcv
#   sqlope.rcv
#   info_data_files.sql
# A file is performed after correcting an environment variable,
# the system password in sqlope.rcv, and a connection identifier

export NLS_LANG=AMERICAN_AMERICA.AL32UTF8
export LANG=C
export ORACLE_BASE=/u01/app/oracle
export ORACLE_HOME=${ORACLE_BASE}/product/12.2.0/dbhome_1
export PATH=${ORACLE_HOME}/bin:${ORACLE_HOME}/OPatch:${PATH}

export ORACLE_SID=emrep
export ORACLE_SID_LOWER=`echo ${ORACLE_SID} | tr "[:upper:]" "[:lower:]"`
export CLOCK=`date`
export RECSEP=*********************************************************************


${ORACLE_HOME}/bin/sqlplus / as sysdba @sqlope.rcv >>getlog.log 2>&1 

grep "ORA-" ${ORACLE_BASE}/admin/${ORACLE_SID}/scripts/*.log | sort > ora_err.log 2>&1 
grep "PLS-" ${ORACLE_BASE}/admin/${ORACLE_SID}/scripts/*.log | sort > pls_err.log 2>&1 

opatch lsinventory -detail > lsinventory_detail.log 2>&1 
