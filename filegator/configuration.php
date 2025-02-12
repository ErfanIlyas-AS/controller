<?php


//get the env file
$envVarsFilePath = '/var/www/env-vars-controller.ini';
if( !file_exists($envVarsFilePath) ) {
  exit( 'Error: Please setup "env-vars-controller.ini" at /var/www/' );
}
$evnVars = parse_ini_file( $envVarsFilePath, false, INI_SCANNER_TYPED );

preg_match( '/^([a-z0-9-]+)\.([a-z.]+)$/i', $evnVars['ROOT_DOMAIN_NAME'], $platformDomainMatches );
$firstFourCharsDomain = substr( $platformDomainMatches[1], 0, 3 );
$restOfCharsDomain = strrev( substr( $platformDomainMatches[1], 3 ) );
$reversedDomainTLD = strrev( str_replace('.','',$platformDomainMatches[2]) );



define( 'CLOUDFLARE_R2_ACCOUNT_ID',   $evnVars['CLOUDFLARE_R2_ACCOUNT_ID'] );
define( 'CLOUDFLARE_R2_BUCKET',       $firstFourCharsDomain.$reversedDomainTLD.$restOfCharsDomain.'-fc' );
define( 'CLOUDFLARE_R2_API_KEY',      $evnVars['CLOUDFLARE_R2_API_KEY'] );
define( 'CLOUDFLARE_R2_API_VALUE_S3', $evnVars['CLOUDFLARE_R2_API_VALUE_S3'] );




return [
    'public_path' => APP_PUBLIC_PATH,
    'public_dir' => APP_PUBLIC_DIR,
    'overwrite_on_upload' => false,
    'timezone' => 'UTC', // https://www.php.net/manual/en/timezones.php
    'download_inline' => ['pdf'], // download inline in the browser, array of extensions, use * for all
    'lockout_attempts' => 5, // max failed login attempts before ip lockout
    'lockout_timeout' => 15, // ip lockout timeout in seconds

    'frontend_config' => [
        'app_name' => 'FileGator',
        'app_version' => APP_VERSION,
        'language' => 'english',
        'logo' => 'https://filegator.io/filegator_logo.svg',
        'upload_max_size' => 100 * 1024 * 1024, // 100MB
        'upload_chunk_size' => 1 * 1024 * 1024, // 1MB
        'upload_simultaneous' => 3,
        'default_archive_name' => 'archive.zip',
        'editable' => ['.txt', '.css', '.js', '.ts', '.html', '.php', '.json', '.md'],
        'date_format' => 'YY/MM/DD hh:mm:ss', // see: https://momentjs.com/docs/#/displaying/format/
        'guest_redirection' => '/',
        'search_simultaneous' => 5,
        'filter_entries' => [],
    ],

    'services' => [
        'Filegator\Services\Logger\LoggerInterface' => [
            'handler' => '\Filegator\Services\Logger\Adapters\MonoLogger',
            'config' => [
                'monolog_handlers' => [
                    function () {
                        return new \Monolog\Handler\StreamHandler(
                            __DIR__.'/private/logs/app.log',
                            \Monolog\Logger::DEBUG
                        );
                    },
                ],
            ],
        ],
        'Filegator\Services\Session\SessionStorageInterface' => [
            'handler' => '\Filegator\Services\Session\Adapters\SessionStorage',
            'config' => [
                'handler' => function () {
                    $save_path = null; // use default system path
                    //$save_path = __DIR__.'/private/sessions';
                    $handler = new \Symfony\Component\HttpFoundation\Session\Storage\Handler\NativeFileSessionHandler($save_path);

                    return new \Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage([
                            "cookie_samesite" => "Lax",
                            "cookie_secure" => null,
                            "cookie_httponly" => true,
                        ], $handler);
                },
            ],
        ],
        'Filegator\Services\Cors\Cors' => [
            'handler' => '\Filegator\Services\Cors\Cors',
            'config' => [
                'enabled' => APP_ENV == 'production' ? false : true,
            ],
        ],
        'Filegator\Services\Tmpfs\TmpfsInterface' => [
            'handler' => '\Filegator\Services\Tmpfs\Adapters\Tmpfs',
            'config' => [
                'path' => __DIR__.'/private/tmp/',
                'gc_probability_perc' => 10,
                'gc_older_than' => 60 * 60 * 24 * 2, // 2 days
            ],
        ],
        'Filegator\Services\Security\Security' => [
            'handler' => '\Filegator\Services\Security\Security',
            'config' => [
                'csrf_protection' => true,
                'csrf_key' => "123456", // randomize this
                'ip_allowlist' => [],
                'ip_denylist' => [],
                'allow_insecure_overlays' => false,
            ],
        ],
        'Filegator\Services\View\ViewInterface' => [
            'handler' => '\Filegator\Services\View\Adapters\Vuejs',
            'config' => [
                'add_to_head' => '',
                'add_to_body' => '',
            ],
        ],
        'Filegator\Services\Storage\Filesystem' => [
            'handler' => '\Filegator\Services\Storage\Filesystem',
            'config' => [
                'separator' => '/',
                'config' => [],
                'adapter' => function () {
                    $client = new \Aws\S3\S3Client([
                        'credentials' => [
                            'key' => CLOUDFLARE_R2_API_KEY,
                            'secret' => CLOUDFLARE_R2_API_VALUE_S3,
                        ],
                        'region' => 'us-east-1',
                        'version' => 'latest',
                        'endpoint' => 'https://'.CLOUDFLARE_R2_ACCOUNT_ID.'.r2.cloudflarestorage.com',
                    ]);

                    return new \League\Flysystem\AwsS3v3\AwsS3Adapter( $client, CLOUDFLARE_R2_BUCKET );
                },
            ],
        ],
        'Filegator\Services\Archiver\ArchiverInterface' => [
            'handler' => '\Filegator\Services\Archiver\Adapters\ZipArchiver',
            'config' => [],
        ],
       'Filegator\Services\Auth\AuthInterface' => [
          'handler' => '\Filegator\Services\Auth\Adapters\WPSPAuth',
          'config' => [
              'wp_dir' => '/var/www/my_wordpress_site/',
              'permissions' => ['read', 'write', 'upload', 'download', 'batchdownload', 'zip'],
              'private_repos' => false,
          ],
        ],
        //'Filegator\Services\Auth\AuthInterface' => [
        //    'handler' => '\Filegator\Services\Auth\Adapters\JsonFile',
        //    'config' => [
        //        'file' => __DIR__.'/private/users.json',
        //    ],
        //],
        'Filegator\Services\Router\Router' => [
            'handler' => '\Filegator\Services\Router\Router',
            'config' => [
                'query_param' => 'r',
                'routes_file' => __DIR__.'/backend/Controllers/routes.php',
            ],
        ],
    ],
];
