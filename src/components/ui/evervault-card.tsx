/* eslint-disable react/no-unescaped-entities */
"use client";
import { useMotionValue } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const EvervaultCard = ({
  text,
  className,
  mouseX,
  mouseY
}: {
  text?: string;
  className?: string;
  mouseX: any;
  mouseY: any
}) => {
  

  return (
    <div
      className={cn(
        "p-0.5  bg-transparent aspect-square  flex items-center justify-center w-full h-full relative",
        className
      )}
    >
      <div
        
        className="rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full"
      >
        <CardPattern mouseX={mouseX} mouseY={mouseY} />
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-44 w-44  rounded-full flex items-center justify-center text-white font-bold text-4xl">
            {/* <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" /> */}
            <span className="dark:text-white text-black z-20">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY }: any) {
  let maskImage = useMotionTemplate`radial-gradient(350px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl  [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-100"></div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-[#00000000] opacity-0  group-hover/card:opacity-100 backdrop-blur-xl transition duration-500"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay  group-hover/card:opacity-100"
        style={style}
      >
        <p className=" absolute inset-x-0 text-sm h-full break-words whitespace-pre-wrap text-[#686868] transition duration-500">
          <p>[2024-07-11 08:23:15] [INFO] System initialization started</p>
          <p>
            [2024-07-11 08:23:16] [DEBUG] Loading configuration files from
            /etc/myapp/config.yaml
          </p>
          <p>
            [2024-07-11 08:23:16] [INFO] Database connection established:
            jdbc:postgresql://localhost:5432/myapp
          </p>
          <p>
            [2024-07-11 08:23:17] [DEBUG] Initializing cache with 1024MB max
            size
          </p>
          <p>[2024-07-11 08:23:18] [INFO] Starting web server on port 8080</p>
          <p>
            [2024-07-11 08:23:19] [DEBUG] Registering REST endpoints: /api/v1/*
          </p>
          <p>
            [2024-07-11 08:23:20] [INFO] Application started successfully in
            5.234 seconds
          </p>
          <p>[2024-07-11 08:24:02] [WARN] High CPU usage detected: 85%</p>
          <p>
            [2024-07-11 08:25:00] [DEBUG] Running scheduled task:
            cleanupExpiredSessions
          </p>
          <p>[2024-07-11 08:25:01] [INFO] Cleaned up 250 expired sessions</p>
          <p>
            [2024-07-11 08:25:30] [ERROR] Failed to connect to payment gateway:
            Connection timeout
          </p>
          <p>
            [2024-07-11 08:25:31] [WARN] Retrying payment gateway connection
            (attempt 1 of 3)
          </p>
          <p>
            [2024-07-11 08:25:32] [INFO] Successfully reconnected to payment
            gateway
          </p>
          <p>
            [2024-07-11 08:26:00] [ERROR] Database query failed with the
            following error: ERROR: relation "users" does not exist LINE 1:
            SELECT * FROM users WHERE id = 12345 ^ STATEMENT: SELECT * FROM
            users WHERE id = 12345
          </p>
          <p>
            [2024-07-11 08:26:05] [WARN] Attempting to recreate 'users' table
            from backup
          </p>
          <p>
            [2024-07-11 08:26:10] [INFO] Table 'users' successfully recreated
          </p>
          <p>
            [2024-07-11 08:27:00] [WARN] Disk usage approaching 80% threshold:
            78% used
          </p>
          <p>[2024-07-11 08:27:15] [DEBUG] Starting backup process</p>
          <p>
            [2024-07-11 08:27:16] [INFO] Backup started:
            myapp_backup_20240711.sql
          </p>
          <p>
            [2024-07-11 08:27:45] [INFO] Backup completed successfully. Size:
            256MB
          </p>
          <p>
            [2024-07-11 08:28:00] [ERROR] Critical security alert: Multiple
            failed login attempts detected Details: - IP Address: 203.0.113.42 -
            Timestamp: 2024-07-11 08:27:55 - Number of attempts: 50 - Targeted
            usernames: admin, root, system Action taken: IP has been temporarily
            blocked for 1 hour
          </p>
          <p>
            [2024-07-11 08:28:30] [DEBUG] Received request: GET
            /api/v1/analytics/daily (IP: 192.168.1.150)
          </p>
          <p>[2024-07-11 08:28:31] [DEBUG] Aggregating daily analytics data</p>
          <p>
            [2024-07-11 08:28:32] [INFO] Analytics report generated successfully
          </p>
          <p>
            [2024-07-11 08:28:33] [DEBUG] Caching analytics report for 1 hour
          </p>
          <p>
            [2024-07-11 08:28:34] [INFO] Request processed successfully in
            3245ms
          </p>
          <p>
            [2024-07-11 08:29:00] [WARN] Unusual traffic detected from IP:
            203.0.113.42
          </p>
          <p>
            [2024-07-11 08:29:01] [INFO] Applying rate limiting to IP:
            203.0.113.42
          </p>
          <p>[2024-07-11 08:30:00] [INFO] Hourly system health check started</p>
          <p>
            [2024-07-11 08:30:05] [ERROR] System health check failed. Details: -
            CPU usage: 92% (Threshold: 80%) - Memory usage: 7.8GB / 8GB (97.5%)
            - Disk I/O: Read 150MB/s, Write 100MB/s (Threshold: 100MB/s total) -
            Network throughput: 950Mbps (Threshold: 800Mbps) Action required:
            Immediate investigation and resource allocation needed
          </p>
          <p>
            [2024-07-11 08:31:00] [ERROR] Exception in thread "main"
            java.lang.OutOfMemoryError: Java heap space at
            java.base/java.util.Arrays.copyOf(Arrays.java:3745) at
            java.base/java.lang.AbstractStringBuilder.ensureCapacityInternal(AbstractStringBuilder.java:172)
            at
            java.base/java.lang.AbstractStringBuilder.append(AbstractStringBuilder.java:538)
            at java.base/java.lang.StringBuilder.append(StringBuilder.java:174)
            at
            com.myapp.processing.DataProcessor.processLargeDataSet(DataProcessor.java:253)
            at
            com.myapp.main.MainApplication.runDataProcessingJob(MainApplication.java:87)
            at com.myapp.main.MainApplication.main(MainApplication.java:45)
          </p>
          <p>
            [2024-07-11 08:31:02] [WARN] Attempting to recover from
            OutOfMemoryError
          </p>
          <p>[2024-07-11 08:31:03] [INFO] Increasing heap size to 8GB</p>
          <p>[2024-07-11 08:31:05] [DEBUG] Restarting data processing job</p>
          <p>
            [2024-07-11 08:32:00] [INFO] Data processing job completed
            successfully after recovery
          </p>
          <p>
            [2024-07-11 08:33:00] [INFO] Starting scheduled data synchronization
            with external CRM system
          </p>
          <p>
            [2024-07-11 08:33:01] [DEBUG] Establishing secure connection to CRM
            API endpoint
          </p>
          <p>
            [2024-07-11 08:33:02] [INFO] Connected to CRM API. Starting data
            transfer
          </p>
          <p>
            [2024-07-11 08:34:00] [ERROR] Data synchronization with CRM failed.
            Details: - Error code: API_ERROR_5023 - Message: Invalid
            authentication token - Timestamp: 2024-07-11 08:33:59 - Affected
            records: 2500/4253 Action taken: Synchronization aborted, partial
            data rollback initiated
          </p>
          <p>
            [2024-07-11 08:34:10] [WARN] Partial data rollback completed. 2500
            records reverted to previous state
          </p>
          <p>
            [2024-07-11 08:34:15] [INFO] Notifying system administrator about
            CRM sync failure
          </p>
          <p>
            [2024-07-11 08:35:00] [DEBUG] Received request: POST
            /api/v1/orders/bulk (IP: 192.168.1.180)
          </p>
          <p>
            [2024-07-11 08:35:01] [INFO] Starting bulk order processing for 500
            orders
          </p>
          <p>
            [2024-07-11 08:35:02] [DEBUG] Validating order data for bulk
            submission
          </p>
          <p>
            [2024-07-11 08:35:10] [INFO] Order validation completed. 498 valid
            orders, 2 invalid orders
          </p>
          <p>
            [2024-07-11 08:35:11] [DEBUG] Beginning database transaction for
            bulk order insertion
          </p>
          <p>
            [2024-07-11 08:35:20] [INFO] Successfully inserted 498 orders into
            the database
          </p>
          <p>
            [2024-07-11 08:35:21] [DEBUG] Updating inventory levels for affected
            products
          </p>
          <p>
            [2024-07-11 08:35:30] [ERROR] Inventory update failed. Details: -
            Error: Deadlock detected - Affected products: SKU12345, SKU67890 -
            Timestamp: 2024-07-11 08:35:29 Action taken: Transaction rolled
            back, retrying with reduced batch size
          </p>
          <p>
            [2024-07-11 08:35:35] [INFO] Retry successful. Inventory updated for
            all affected products
          </p>
          <p>
            [2024-07-11 08:35:40] [INFO] Order fulfillment process initiated
            successfully
          </p>
          <p>
            [2024-07-11 08:35:41] [WARN] 2 orders were not processed due to
            validation errors. Order IDs: 1234, 5678
          </p>
          <p>
            [2024-07-11 08:35:42] [INFO] Bulk order processing completed in 42
            seconds
          </p>
          <p>
            [2024-07-11 08:36:00] [DEBUG] Received request: GET
            /api/v1/system/status (IP: 192.168.1.190)
          </p>
          <p>[2024-07-11 08:36:01] [INFO] Generating system status report</p>
          <p>[2024-07-11 08:36:02] [DEBUG] Checking all system components</p>
          <p>
            [2024-07-11 08:36:03] [INFO] System Status: - Web Server: OK (4/4
            instances running) - Database: WARNING (High load on master, 1
            replica out of sync) - Cache: OK (89% hit rate) - Message Queue:
            WARNING (Current depth: 10,000+ messages, processing delay detected)
            - Storage: CRITICAL (92% capacity used, immediate action required) -
            CDN: OK (99.98% uptime in last 24 hours) - External APIs: WARNING (2
            endpoints experiencing high latency) - Batch Jobs: ERROR (2 critical
            jobs failed in last hour) - Monitoring: OK (All alerts configured
            and active)
          </p>
          <p>
            [2024-07-11 08:36:04] [WARN] Multiple system components showing
            warnings or errors. Escalating to on-call team.
          </p>
          <p>
            [2024-07-11 08:36:05] [INFO] System status report generated
            successfully
          </p>
          <p>
            [2024-07-11 08:36:06] [DEBUG] Sending system status report to
            admin@example.com and oncall@example.com
          </p>
          <p>
            [2024-07-11 08:36:07] [INFO] Request processed successfully in
            7000ms
          </p>
          <p>
            [2024-07-11 08:37:00] [CRITICAL] Potential security breach detected:
            Details: - Timestamp: 2024-07-11 08:36:58 - Source IP: 198.51.100.77
            - Targeted system: User Authentication Service - Attack vector:
            Suspected SQL injection attempt - Number of attempts: 25 in last 60
            seconds Actions taken: 1. IP address 198.51.100.77 has been blocked
            2. User Authentication Service temporarily disabled 3. Security team
            alerted via PagerDuty 4. Automated system audit initiated Further
            investigation required urgently.
          </p>
        </p>
      </motion.div>
    </div>
  );
}

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
