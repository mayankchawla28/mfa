import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AllExceptionFilter } from "@common/filters/all-exception.filter";
import bodyParser from "body-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import path from "path";
// import { ApiKeyGuard } from "@common/guards/api-key.guard";
// import { TimeoutInterceptor } from "@common/interceptors/timeout.interceptor";
// import { WrapResponseInterceptor } from "@common/interceptors/wrap-response.interceptor";
// import { ApiKeyGuard } from "@common/guards/api-key.guard";

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  // app.useGlobalInterceptors(new WrapResponseInterceptor(), new TimeoutInterceptor());
  // app.useGlobalGuards(new ApiKeyGuard());
  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const viewsPath = path.join(__dirname, "../../views");

  app.setBaseViewsDir(viewsPath);
  app.setViewEngine("ejs");
  app.use(bodyParser.json({ limit: "2mb" }));
  app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));
  await app.listen(3000);
}
bootstrap();
